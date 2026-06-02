import express from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { authRequired } from "../middleware/auth.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.js";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function issueAuth(res, user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  console.log("[AUTH] Tokens generated for:", user.email, "accessToken length:", accessToken.length);
  return res.json({
    accessToken,
    refreshToken,
    user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role }
  });
}

router.post(
  "/signup",
  body("name").trim().isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid payload", errors: errors.array() });

      const { name, email, password } = req.body;
      console.log("[SIGNUP] Attempt:", email);

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(409).json({ message: "Email already registered" });

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email: email.toLowerCase(), passwordHash, provider: "local" });
      console.log("[SIGNUP] User created:", user._id, user.email);
      return issueAuth(res, user);
    } catch (err) {
      console.error("[SIGNUP] Error:", err.message);
      return res.status(500).json({ message: "Signup failed. Please try again." });
    }
  }
);

router.post("/login", body("email").isEmail(), body("password").isLength({ min: 1 }), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid payload", errors: errors.array() });

    const { email, password } = req.body;
    console.log("[LOGIN] Attempt body:", { email: email?.toLowerCase(), password: password ? "[REDACTED]" : "[EMPTY]" });

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("[LOGIN] User found:", user ? "yes (" + user.email + ")" : "no", "passwordHash:", user?.passwordHash ? "present" : "absent");

    if (!user || !user.passwordHash) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    console.log("[LOGIN] Password match:", ok);

    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    return issueAuth(res, user);
  } catch (err) {
    console.error("[LOGIN] Error:", err.message);
    return res.status(500).json({ message: "Login failed. Please try again." });
  }
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "Missing refresh token" });
  try {
    const payload = verifyRefreshToken(refreshToken);
    console.log("[REFRESH] Token payload sub:", payload.sub, "v:", payload.v);
    const user = await User.findById(payload.sub);
    console.log("[REFRESH] User found:", !!user, "version match:", user?.refreshTokenVersion === payload.v);
    if (!user || user.refreshTokenVersion !== payload.v) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    return issueAuth(res, user);
  } catch (err) {
    console.error("[REFRESH] Error:", err?.message || "unknown");
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

router.post("/logout", authRequired, async (req, res) => {
  try {
    console.log("[LOGOUT] User:", req.user.sub);
    await User.findByIdAndUpdate(req.user.sub, { $inc: { refreshTokenVersion: 1 } });
    console.log("[LOGOUT] refreshTokenVersion incremented");
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error("[LOGOUT] Error:", err.message);
    return res.status(500).json({ message: "Logout failed" });
  }
});

router.post("/google", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: "Missing idToken" });
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase();
    if (!email) return res.status(400).json({ message: "Google token missing email" });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: payload?.name || email.split("@")[0],
        email,
        provider: "google",
        googleId: payload?.sub || ""
      });
    }
    return issueAuth(res, user);
  } catch {
    return res.status(401).json({ message: "Invalid Google token" });
  }
});

router.get("/me", authRequired, async (req, res) => {
  try {
    console.log("[ME] Fetching user sub:", req.user.sub);
    const user = await User.findById(req.user.sub).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("[ME] User found:", user.email);
    return res.json({ user });
  } catch (err) {
    console.error("[ME] Error:", err.message);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
});

router.post("/forgot-password", body("email").isEmail(), (req, res) => {
  const { email } = req.body;
  return res.json({
    message: email
      ? "If this email exists, a reset link has been sent."
      : "Please provide a valid email."
  });
});

export default router;

