import { AICache } from "../models/aiCache.model";

export const getCachedResponse = async (key: string) => {
  return await AICache.findOne({ key });
};

export const setCachedResponse = async (
  key: string,
  response: any,
  ttlMinutes = 60
) => {
  const expiresAt = new Date(
    Date.now() + ttlMinutes * 60 * 1000
  );

  await AICache.create({ key, response, expiresAt });
};
