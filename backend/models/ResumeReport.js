import mongoose from "mongoose";

const resumeReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    uploadFileId: { type: mongoose.Schema.Types.ObjectId, ref: "UploadFile", required: true },
    atsScore: { type: Number, min: 0, max: 100, required: true },
    extractedSkills: [{ type: String }],
    missingKeywords: [{ type: String }],
    jobMatch: { type: String, default: "" },
    summary: { type: String, default: "" },
    aiSummary: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("ResumeReport", resumeReportSchema);

