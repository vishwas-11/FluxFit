import { Source } from "../models/source.model";

export const ingestSelectedYouTube = async (
  videos: {
    videoId: string;
    title: string;
    url: string;
    thumbnail: string;
    channelTitle: string;
    tags: string[];
  }[]
) => {
  const docs = videos.map(v => ({
    title: v.title,
    url: v.url,
    type: "youtube",
    content: "",
    tags: v.tags,
    youtube: {
      videoId: v.videoId,
      channelTitle: v.channelTitle,
      thumbnail: v.thumbnail,
    },
  }));

  return Source.insertMany(docs, { ordered: false });
};
