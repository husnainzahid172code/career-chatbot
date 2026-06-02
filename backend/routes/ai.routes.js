import express from "express";
import mongoose from "mongoose";
import { body, query, validationResult } from "express-validator";
import { askGemini, askGeminiChunked } from "../services/geminiService.js";
import { authRequired } from "../middleware/auth.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Roadmap from "../models/Roadmap.js";

const router = express.Router();

router.get(
  "/chats",
  authRequired,
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 50 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid query", errors: errors.array() });
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Chat.find({ userId: req.user.sub }).sort({ lastMessageAt: -1 }).skip(skip).limit(limit),
      Chat.countDocuments({ userId: req.user.sub })
    ]);
    return res.json({ items, total, page, limit, pages: Math.ceil(total / limit) });
  }
);

router.get("/chats/:chatId/messages", authRequired, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.chatId)) return res.status(400).json({ message: "Invalid chatId" });
  const chat = await Chat.findOne({ _id: req.params.chatId, userId: req.user.sub });
  if (!chat) return res.status(404).json({ message: "Chat not found" });
  const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 }).limit(500);
  return res.json({ chat, messages });
});

router.delete("/messages/:messageId", authRequired, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.messageId)) return res.status(400).json({ message: "Invalid messageId" });
  await Message.deleteOne({ _id: req.params.messageId, userId: req.user.sub });
  return res.json({ message: "Deleted" });
});

router.post("/chat", authRequired, body("prompt").trim().isLength({ min: 1 }), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid payload", errors: errors.array() });
    const { prompt, context, chatId } = req.body;
    let chat = null;
    if (chatId && mongoose.isValidObjectId(chatId)) {
      chat = await Chat.findOne({ _id: chatId, userId: req.user.sub });
    }
    if (!chat) {
      chat = await Chat.create({
        userId: req.user.sub,
        title: prompt.slice(0, 50) || "New Chat",
        model: "gemini-2.5-flash",
        lastMessageAt: new Date()
      });
    }

    await Message.create({
      chatId: chat._id,
      userId: req.user.sub,
      role: "user",
      content: prompt
    });

    const prev = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 }).limit(20);
    const memory = prev.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
    const text = await askGemini(prompt, [context, memory].filter(Boolean).join("\n\n"));

    const assistant = await Message.create({
      chatId: chat._id,
      userId: req.user.sub,
      role: "assistant",
      content: text
    });
    chat.lastMessageAt = new Date();
    await chat.save();
    return res.json({ text, chatId: chat._id, messageId: assistant._id });
  } catch (err) {
    return res.status(500).json({ message: err.message || "AI request failed" });
  }
});

router.get("/chat/stream", authRequired, async (req, res) => {
  const prompt = (req.query.prompt || "").toString().trim();
  const chatId = (req.query.chatId || "").toString();
  if (!prompt) return res.status(400).json({ message: "Prompt is required" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let chat = null;
  if (chatId && mongoose.isValidObjectId(chatId)) {
    chat = await Chat.findOne({ _id: chatId, userId: req.user.sub });
  }
  if (!chat) {
    chat = await Chat.create({
      userId: req.user.sub,
      title: prompt.slice(0, 50) || "New Chat",
      model: "gemini-2.5-flash",
      lastMessageAt: new Date()
    });
  }
  await Message.create({ chatId: chat._id, userId: req.user.sub, role: "user", content: prompt });
  const prev = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 }).limit(20);
  const memory = prev.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");

  let full = "";
  for await (const chunk of askGeminiChunked(prompt, memory)) {
    full += chunk;
    res.write(`data: ${JSON.stringify({ type: "chunk", chunk, chatId: chat._id })}\n\n`);
  }
  const assistant = await Message.create({
    chatId: chat._id,
    userId: req.user.sub,
    role: "assistant",
    content: full
  });
  chat.lastMessageAt = new Date();
  await chat.save();
  res.write(`data: ${JSON.stringify({ type: "done", chatId: chat._id, messageId: assistant._id })}\n\n`);
  res.end();
});

router.post("/career-roadmap", authRequired, body("field").notEmpty(), async (req, res) => {
  try {
    const { field, skillLevel, desiredRole } = req.body;
    const prompt = `Create a personalized career roadmap for:
Field: ${field}
Current skill level: ${skillLevel}
Desired role: ${desiredRole}

Return sections:
1) Required skills
2) Certifications
3) 6-month timeline
4) Courses and learning resources
5) Portfolio project ideas`;

    const text = await askGemini(prompt);
    const doc = await Roadmap.create({
      userId: req.user.sub,
      field,
      skillLevel,
      desiredRole,
      content: text
    });
    return res.json({ roadmap: text, roadmapId: doc._id });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Roadmap generation failed" });
  }
});

router.post("/internship-assistant", authRequired, async (req, res) => {
  try {
    const { goal } = req.body;
    const prompt = `Internship assistant request: ${goal}
Provide:
- application guidance
- interview questions
- cover letter starter
- HR follow-up email template
- weekly preparation roadmap`;
    const text = await askGemini(prompt);
    return res.json({ response: text });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Internship assistant failed" });
  }
});

router.get("/roadmaps", authRequired, async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Roadmap.find({ userId: req.user.sub }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Roadmap.countDocuments({ userId: req.user.sub })
  ]);
  return res.json({ items, total, page, limit, pages: Math.ceil(total / limit) });
});

export default router;

