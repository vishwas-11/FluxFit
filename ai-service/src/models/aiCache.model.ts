import { Schema, model } from "mongoose";

const aiCacheSchema = new Schema(
  {
    key: { type: String, unique: true },
    response: Object,
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

aiCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AICache = model("AICache", aiCacheSchema);
