import { z } from "zod";

export const logSchema = z.object({
  date: z.string(),
  weight: z.number().optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  workout: z
    .object({
      type: z.string(),
      duration: z.number(),
    })
    .optional(),
  nutrition: z
    .object({
      calories: z.number(),
      protein: z.number(),
    })
    .optional(),
});
