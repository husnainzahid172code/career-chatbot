import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { simpleRateLimit } from "./middleware/rateLimit.js";

dotenv.config();
connectDB();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(simpleRateLimit(100, 60_000));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "CareerPilot AI API", ts: Date.now() });
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error" });
});

app.listen(port, () => {
  console.log(`CareerPilot API listening on http://localhost:${port}`);
});

