import { Router } from "express";
import { getGameResults, getGameResultByRoom } from "../controllers/gameResult.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateParams } from "../middleware/validate";
import { z } from "zod";

const router = Router();

// Require authentication for game results endpoints
router.get("/", authMiddleware, getGameResults);
router.get("/:code", authMiddleware, validateParams(z.object({ code: z.string().regex(/^[A-Za-z0-9]{4,10}$/) })), getGameResultByRoom);

export default router;
