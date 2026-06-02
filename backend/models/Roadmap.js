import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    field: { type: String, required: true, trim: true, maxlength: 100 },
    skillLevel: { type: String, required: true, trim: true, maxlength: 40 },
    desiredRole: { type: String, required: true, trim: true, maxlength: 100 },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Roadmap", roadmapSchema);

