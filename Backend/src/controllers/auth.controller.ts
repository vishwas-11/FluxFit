import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  loginOrRegisterWithGoogle,
} from "../services/auth.service";
import { generateToken } from "../utils/jwt";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const user = await registerUser(name, email, password);
  const token = generateToken({ id: user._id });

  sendSuccess(
    res,
    {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
    "User registered successfully",
    201
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await loginUser(email, password);
  const token = generateToken({ id: user._id });

  sendSuccess(res, {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// Google OAuth (ID token exchange)
// Frontend obtains Google ID token using Google Identity Services, then sends it here.
export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { credential } = req.body as { credential: string };

    const user = await loginOrRegisterWithGoogle(credential);
    const token = generateToken({ id: user._id });

    sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      "Google authentication successful"
    );
  } catch (err: any) {
    // Normalize to your error middleware format (statusCode supported)
    const e: any = new Error(err?.message || "Google authentication failed");
    e.statusCode = err?.statusCode || 401;
    throw e;
  }
});
