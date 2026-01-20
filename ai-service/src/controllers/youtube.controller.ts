import { Request, Response } from "express";
import { searchYouTubeVideos } from "../services/youtubeSearch.service";
import { sendSuccess } from "../utils/response";

export const recommendYouTubeVideos = async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({
      success: false,
      message: "query is required",
    });
  }

  const videos = await searchYouTubeVideos(query, 6);

  return sendSuccess(res, {
    youtubeVideos: videos.map(v => ({
      videoId: v.videoId,
      title: v.title,
      thumbnail: v.thumbnail,
      url: `https://www.youtube.com/watch?v=${v.videoId}`,
    })),
  });
};
