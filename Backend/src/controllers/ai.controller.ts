import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { getAIRecommendation } from "../services/ai.service";
import { getUserProfile } from "../services/user.service";
import { gatherUserLogs } from "../services/log.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  url: string;
}

export const recommend = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // Prefer the profile/logs sent from the recommendation form.
    // Fall back to persisted user profile/logs if not provided.
    const bodyProfile = (req.body as any)?.profile;
    const bodyLogs = (req.body as any)?.recentLogs;

    const profile = bodyProfile ?? (await getUserProfile(req.userId!));
    const logs = Array.isArray(bodyLogs) ? bodyLogs : await gatherUserLogs(req.userId!);

    /**
     * 🔹 getAIRecommendation already:
     * - calls plan + narrative endpoints
     * - merges results
     * - returns pure JS object
     */
    const aiData = await getAIRecommendation(profile, logs);

    const youtubeVideos: YouTubeVideo[] =
      aiData.youtubeVideos?.map((v: any) => ({
        videoId: v.videoId,
        title: v.title,
        thumbnail: v.thumbnail,
        url: v.url,
      })) || [];

    /**
     * ✅ STABLE RESPONSE CONTRACT
     */
    return sendSuccess(res, {
      profile,
      recommendation: aiData.recommendation ?? aiData,
      youtubeVideos,
    });
  }
);
