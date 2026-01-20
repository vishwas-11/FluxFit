import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";

export function useRecommendation() {
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await axios.post("/ai/recommend", payload);
      return res.data;
    },
  });
}
