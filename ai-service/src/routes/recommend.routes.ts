import { Router } from "express";
import {
  generatePlan,
  generateNarrative,
} from "../controllers/recommend.controller";
import { internalAuth } from "../middlewares/internalAuth";
import { aiRateLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

/**
 * Split endpoints
 */
router.post("/plan", internalAuth, aiRateLimiter, generatePlan);
router.post("/narrative", internalAuth, aiRateLimiter, generateNarrative);

export default router;
