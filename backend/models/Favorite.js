import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["message", "roadmap", "report"], required: true },
    refId: { type: mongoose.Schema.Types.ObjectId, required: true },
    note: { type: String, default: "", maxlength: 280 }
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, type: 1, refId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);

