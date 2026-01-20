import { Request, Response, NextFunction } from "express";

export const internalAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers["x-internal-key"] !== process.env.INTERNAL_API_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};
