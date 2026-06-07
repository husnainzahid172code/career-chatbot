import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET environment variable is not set");
if (!process.env.JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET environment variable is not set");
const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, name: user.name, role: user.role },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), v: user.refreshTokenVersion ?? 0 },
    REFRESH_SECRET,
    { expiresIn: "30d" }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

