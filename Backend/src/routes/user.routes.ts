import { Router } from "express";
import {
  getProfile,
  updateProfile,
} from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

export default router;
