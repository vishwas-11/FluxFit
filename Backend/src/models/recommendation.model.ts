import { Schema, Types } from "mongoose";

const recommendationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    recommendation: Schema.Types.Mixed,
    sources: [
      {
        title: String,
        url: String,
      },
    ],
    youtubeVideos: [
      {
        title: String,
        videoId: String,
        thumbnail: String,
      },
    ],
  },
  { timestamps: true }
);

