import rateLimit from "express-rate-limit";

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 AI requests per minute
  message: {
    success: false,
    message:
      "AI request limit exceeded. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
