import express from "express";
import { createRoom, getRoomState } from "../controllers/room.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Crear sala + trivia
router.post("/", authMiddleware, createRoom);

// Obtener estado de sala
router.get("/:code", authMiddleware, getRoomState);

export default router;