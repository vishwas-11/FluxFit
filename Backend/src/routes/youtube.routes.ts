import { Router } from "express";
import { recommendVideos } from "../controllers/youtube.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/recommend", protect, recommendVideos);

export default router;
