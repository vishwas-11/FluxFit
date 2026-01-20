import { Request, Response, NextFunction } from "express";
import { generateRequestId } from "../utils/requestId";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = generateRequestId();

  req.headers["x-request-id"] = requestId;
  res.setHeader("x-request-id", requestId);

  const start = Date.now();

  res.on("finish", () => {
    const log = {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      timestamp: new Date().toISOString(),
    };

    console.log(JSON.stringify(log));
  });

  next();
};
