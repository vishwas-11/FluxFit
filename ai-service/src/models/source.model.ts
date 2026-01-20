import { Schema, model } from "mongoose";

const sourceSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    
    type: {
      type: String,
      enum: ["article", "youtube"],
      required: true,
    },
    
    content: { type: String, default: "" },
    
    tags: [{ type: String }],
    
    // Add category field for better organization
    category: {
      type: String,
      enum: [
        "weight-loss",
        "muscle-building",
        "home-workout",
        "injury-management",
        "nutrition",
        "cardio",
        "beginner",
        "advanced",
        "general"
      ],
      default: "general"
    },
    
    // YouTube-specific fields
    youtube: {
      videoId: String,
      channelTitle: String,
      thumbnail: String,
    },
  },
  { timestamps: true }
);

// Index for faster tag-based queries
sourceSchema.index({ tags: 1 });
sourceSchema.index({ category: 1 });

export const Source = model("Source", sourceSchema);