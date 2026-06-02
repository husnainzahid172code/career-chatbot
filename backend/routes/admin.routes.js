import express from "express";
import { authRequired } from "../middleware/auth.js";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import ResumeReport from "../models/ResumeReport.js";
import Roadmap from "../models/Roadmap.js";

const router = express.Router();

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  return next();
}

router.get("/analytics", authRequired, adminOnly, async (_req, res) => {
  const [users, chats, messages, reports, roadmaps] = await Promise.all([
    User.countDocuments(),
    Chat.countDocuments(),
    Message.countDocuments(),
    ResumeReport.countDocuments(),
    Roadmap.countDocuments()
  ]);

  return res.json({
    cards: { users, chats, messages, reports, roadmaps }
  });
});

export default router;

