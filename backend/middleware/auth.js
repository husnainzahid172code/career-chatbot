import { verifyAccessToken } from "../utils/tokens.js";

export function authRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const token =
    (auth.startsWith("Bearer ") ? auth.slice(7) : null) ||
    (typeof req.query.accessToken === "string" ? req.query.accessToken : null);
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

