import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "New Chat", trim: true, maxlength: 120 },
    model: { type: String, default: "gemini-2.5-flash" },
    lastMessageAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

chatSchema.index({ userId: 1, lastMessageAt: -1 });

export default mongoose.model("Chat", chatSchema);

