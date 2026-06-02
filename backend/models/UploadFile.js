import mongoose from "mongoose";

const uploadFileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    extractedText: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("UploadFile", uploadFileSchema);

