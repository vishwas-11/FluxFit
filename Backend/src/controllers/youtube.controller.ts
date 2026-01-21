import { Request, Response } from "express";
import axios from "axios";
import { sendSuccess } from "../utils/response";

export const recommendVideos = async (req: Request, res: Response) => {
  try {
    const { goal, diet } = req.body;

    const query = [goal, diet, "workout"].filter(Boolean).join(" ");

    // AI_SERVICE_URL is used elsewhere for internal endpoints (often includes `/api/internal`).
    // YouTube routes in ai-service are mounted at `/api/youtube/*`, so we must call the service origin.
    const aiServiceOrigin = (() => {
      const raw =
        process.env.AI_SERVICE_URL ||
        process.env.AI_SERVICE_BASE_URL ||
        "http://localhost:6000";
      try {
        return new URL(raw).origin;
      } catch {
        // fallback if raw is malformed; keep previous behavior
        return raw.replace(/\/+$/, "");
      }
    })();

    const response = await axios.post(
      `${aiServiceOrigin}/youtube/recommend`,
      { query },
      {
        headers: {
          "x-internal-key": process.env.INTERNAL_API_KEY,
        },
        timeout: 10000,
      }
    );

    // Normalize response shape for frontend:
    // frontend expects: { data: { youtubeVideos: [...] } }
    const raw = response.data?.data;
    const youtubeVideos = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.youtubeVideos)
        ? raw.youtubeVideos
        : [];

    return sendSuccess(res, { youtubeVideos });
  } catch (err: any) {
    const statusCode = err?.response?.status || 500;
    const upstreamMessage =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Failed to recommend videos";
    const e: any = new Error(upstreamMessage);
    e.statusCode = statusCode;
    throw e;
  }
};
