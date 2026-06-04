import express from "express";
import { body, validationResult } from "express-validator";
import { authRequired } from "../middleware/auth.js";
import { extractSkills, rankJobs, getSampleJobs } from "../services/jobMatcherService.js";

const router = express.Router();

router.get("/jobs", (_req, res) => {
  return res.json({ jobs: getSampleJobs() });
});

router.post("/extract-skills", authRequired, body("text").trim().isLength({ min: 10 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid input", errors: errors.array() });
  const skills = extractSkills(req.body.text);
  return res.json({ skills });
});

router.post("/match", authRequired, body("resumeText").trim().isLength({ min: 10 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid input", errors: errors.array() });
  const { resumeText } = req.body;
  const { resumeSkills, results } = rankJobs(resumeText);
  return res.json({ resumeSkills, matches: results });
});

export default router;
