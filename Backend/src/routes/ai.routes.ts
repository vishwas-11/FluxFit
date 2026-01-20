import { Router } from "express";
import { recommend } from "../controllers/ai.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();
router.post("/recommend", protect, recommend);
export default router;
