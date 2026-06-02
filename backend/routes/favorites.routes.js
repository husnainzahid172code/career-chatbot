import express from "express";
import { body } from "express-validator";
import { authRequired } from "../middleware/auth.js";
import Favorite from "../models/Favorite.js";

const router = express.Router();

router.get("/", authRequired, async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Favorite.find({ userId: req.user.sub }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Favorite.countDocuments({ userId: req.user.sub })
  ]);
  return res.json({ items, total, page, limit, pages: Math.ceil(total / limit) });
});

router.post(
  "/",
  authRequired,
  body("type").isIn(["message", "roadmap", "report"]),
  body("refId").notEmpty(),
  async (req, res) => {
    const { type, refId, note = "" } = req.body;
    const doc = await Favorite.findOneAndUpdate(
      { userId: req.user.sub, type, refId },
      { $set: { note } },
      { new: true, upsert: true }
    );
    return res.json(doc);
  }
);

router.delete("/:id", authRequired, async (req, res) => {
  await Favorite.deleteOne({ _id: req.params.id, userId: req.user.sub });
  return res.json({ message: "Removed" });
});

export default router;

