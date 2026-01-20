import api from "./axios";

export const getRecommendation = async (payload: unknown) => {
  return api.post("/ai/recommend", payload);
};
