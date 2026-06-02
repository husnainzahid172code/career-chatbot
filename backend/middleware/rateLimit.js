const requests = new Map();

export function simpleRateLimit(limit = 60, windowMs = 60_000) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || "unknown";
    const now = Date.now();
    const bucket = requests.get(ip) || [];
    const fresh = bucket.filter((ts) => now - ts < windowMs);
    fresh.push(now);
    requests.set(ip, fresh);
    if (fresh.length > limit) {
      return res.status(429).json({ message: "Too many requests. Try again later." });
    }
    return next();
  };
}

