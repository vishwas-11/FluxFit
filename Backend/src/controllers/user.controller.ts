import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import {
  getUserProfile,
  updateUserProfile,
} from "../services/user.service";

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await getUserProfile(req.userId!);
    sendSuccess(res, user, "Profile fetched");
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await updateUserProfile(req.userId!, req.body);
    sendSuccess(res, user, "Profile updated");
  }
);
