import express from "express";
import multer from "multer";
import * as pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { authRequired } from "../middleware/auth.js";
import { analyzeResumeText } from "../utils/resumeAnalyzer.js";
import { askGemini } from "../services/geminiService.js";
import UploadFile from "../models/UploadFile.js";
import ResumeReport from "../models/ResumeReport.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];
    cb(null, allowed.includes(file.mimetype));
  }
});

async function extractTextFromUpload(file) {
  if (file.mimetype === "text/plain") return file.buffer.toString("utf-8");
  if (file.mimetype === "application/pdf") {
    const parser = pdfParse.default ?? pdfParse;
    const out = await parser(file.buffer);
    return out.text || "";
  }
  if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const out = await mammoth.extractRawText({ buffer: file.buffer });
    return out.value || "";
  }
  return "";
}

router.post("/resume", authRequired, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File is required" });
    const text = await extractTextFromUpload(req.file);
    const jobDescription = req.body.jobDescription || "";
    if (!text.trim()) return res.status(400).json({ message: "Could not extract readable text from file" });

    const localAnalysis = analyzeResumeText(text, jobDescription);
    const aiSummary = await askGemini(
      `Analyze this resume text and give concise improvements, ATS hints, and missing keywords:\n\n${text.slice(0, 5000)}`
    );

    const uploadDoc = await UploadFile.create({
      userId: req.user.sub,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      extractedText: text.slice(0, 50_000)
    });
    const report = await ResumeReport.create({
      userId: req.user.sub,
      uploadFileId: uploadDoc._id,
      atsScore: localAnalysis.atsScore,
      extractedSkills: localAnalysis.extractedSkills,
      missingKeywords: localAnalysis.missingKeywords,
      jobMatch: localAnalysis.jobMatch,
      summary: localAnalysis.summary,
      aiSummary
    });

    return res.json({
      reportId: report._id,
      fileName: req.file.originalname,
      analysis: localAnalysis,
      aiSummary
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Upload analysis failed" });
  }
});

router.get("/reports", authRequired, async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    ResumeReport.find({ userId: req.user.sub })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("uploadFileId"),
    ResumeReport.countDocuments({ userId: req.user.sub })
  ]);
  return res.json({ items, total, page, limit, pages: Math.ceil(total / limit) });
});

router.get("/reports/:id/download", authRequired, async (req, res) => {
  const report = await ResumeReport.findOne({ _id: req.params.id, userId: req.user.sub }).populate("uploadFileId");
  if (!report) return res.status(404).json({ message: "Report not found" });
  const content = [
    `CareerPilot AI Resume Report`,
    `File: ${report.uploadFileId?.originalName || "Unknown"}`,
    `ATS Score: ${report.atsScore}`,
    `Extracted Skills: ${report.extractedSkills.join(", ")}`,
    `Missing Keywords: ${report.missingKeywords.join(", ")}`,
    `Job Match: ${report.jobMatch}`,
    `Summary: ${report.summary}`,
    "",
    "AI Summary:",
    report.aiSummary
  ].join("\n");
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", `attachment; filename=\"resume-report-${report._id}.txt\"`);
  return res.send(content);
});

export default router;

