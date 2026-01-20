import { Router } from "express";
import { recommendYouTubeVideos } from "../controllers/youtube.controller";
import { internalAuth } from "../middlewares/internalAuth";

const router = Router();

router.post("/recommend", internalAuth, recommendYouTubeVideos);

export default router;
