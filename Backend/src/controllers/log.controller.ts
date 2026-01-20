import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createLog, gatherUserLogs } from "../services/log.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export const addLog = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const log = await createLog(req.userId!, req.body);

    sendSuccess(res, log, "Log created", 201);
  }
);

export const getLogs = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const logs = await gatherUserLogs(req.userId!);

    sendSuccess(res, logs, "Logs fetched");
  }
);
