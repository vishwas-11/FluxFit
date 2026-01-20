import axios from "axios";

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

export interface YouTubeVideo {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
}

export const searchYouTubeVideos = async (
  query: string,
  maxResults = 5
): Promise<YouTubeVideo[]> => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY not set");
  }

  // 1️⃣ Search videos
  const searchResponse = await axios.get(YOUTUBE_SEARCH_URL, {
    params: {
      key: apiKey,
      q: query,
      part: "snippet",
      type: "video",
      maxResults,
      relevanceLanguage: "en",
      safeSearch: "moderate",
    },
  });

  const items = searchResponse.data.items || [];
  if (!items.length) return [];

  const videoIds = items.map((item: any) => item.id.videoId);

  // 2️⃣ Fetch durations
  const videoResponse = await axios.get(YOUTUBE_VIDEOS_URL, {
    params: {
      key: apiKey,
      id: videoIds.join(","),
      part: "contentDetails",
    },
  });

  const durationMap: Record<string, string> = {};
  videoResponse.data.items.forEach((v: any) => {
    durationMap[v.id] = v.contentDetails.duration;
  });

  // 3️⃣ Normalize output
  return items.map((item: any) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.high.url,
    publishedAt: item.snippet.publishedAt,
    duration: durationMap[item.id.videoId],
  }));
};
