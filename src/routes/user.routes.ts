import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

export default router;