import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const errorLog = {
    requestId: err.requestId || req.headers["x-request-id"],
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  };

  console.error(JSON.stringify(errorLog));

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
    requestId: errorLog.requestId,
  });
};
