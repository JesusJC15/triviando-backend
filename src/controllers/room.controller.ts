import { Request, Response } from "express";
import { Room, generateUniqueRoomCode } from "../models/room.model";
import { Trivia } from "../models/trivia.model";
import { generateQuestions } from "../services/aiGenerator.service";
import { Types } from "mongoose";
import redis from "../config/redis";
import User from "../models/user.model";
import { joinRoomAtomically } from "../services/joinRoom.service";

const ROOM_CACHE_TTL = 120; // segundos (2 min)

// ───────────────
// Crear sala
// ───────────────
export const createRoom = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const { topic, maxPlayers = 4, quantity = 5 } = req.body;

    // Validaciones básicas
    if (!topic?.trim()) {
      return res.status(400).json({ message: "Debes enviar un tema válido." });
    }
    if (quantity < 5 || quantity > 20) {
      return res.status(400).json({ message: "Cantidad de preguntas inválida (5 a 20)." });
    }
    if (maxPlayers < 2 || maxPlayers > 10) {
      return res.status(400).json({ message: "Número de jugadores inválido (2 a 10)." });
    }

    // 1️⃣ Crear trivia con IA
    const questions = await generateQuestions(topic, quantity);
    const trivia = await new Trivia({ topic, questions, creator: user.id }).save();

    // 2️⃣ Generar código único de sala
    const code = await generateUniqueRoomCode();

    // 3️⃣ Obtener nombre del usuario
    const playerName =
      user.name ||
      (await User.findById(user.id).select("name").lean())?.name ||
      "Anonymous";

    const player = {
      userId: new Types.ObjectId(user.id),
      name: playerName,
      joinedAt: new Date(),
    };

    // 4️⃣ Crear sala en DB
    const room = await new Room({
      code,
      hostId: user.id,
      triviaId: trivia._id,
      maxPlayers,
      players: [player],
    }).save();

    // 5️⃣ Cachear estado inicial en Redis
    const cacheData = {
      code: room.code,
      status: room.status,
      players: room.players.map((p) => ({ userId: p.userId, name: p.name })),
      maxPlayers: room.maxPlayers,
      hostId: room.hostId,
    };
    await redis.setex(`room:${code}:state`, ROOM_CACHE_TTL, JSON.stringify(cacheData));

    return res.status(201).json({
      message: "Sala creada 🎉",
      code: room.code,
      triviaId: trivia._id,
      maxPlayers,
      host: player.name,
    });
  } catch (error: any) {
    console.error("[createRoom] Error:", error);
    return res.status(500).json({
      message: "Error creando la sala",
      error: error.message,
    });
  }
};

// ───────────────
// Unirse a sala (atómico)
// ───────────────
export const joinRoom = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { code } = req.body;

    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });
    if (!code?.trim()) return res.status(400).json({ message: "Código de sala requerido." });

    const { ok, message, room } = await joinRoomAtomically(code, user.id, user.name);
    if (!ok) return res.status(400).json({ message });

    // 6️⃣ Actualizar cache Redis
    const cacheData = {
      code: room.code,
      status: room.status,
      players: room.players.map((p: any) => ({ userId: p.userId, name: p.name })),
      maxPlayers: room.maxPlayers,
      hostId: room.hostId,
    };
    await redis.setex(`room:${code}:state`, ROOM_CACHE_TTL, JSON.stringify(cacheData));

    // 🔹 Retornar solo datos sanitizados
    const sanitizedRoom = {
      code: room.code,
      status: room.status,
      maxPlayers: room.maxPlayers,
      players: room.players.map((p: any) => ({ userId: p.userId, name: p.name })),
      hostId: room.hostId,
    };

    return res.status(200).json({ message, room: sanitizedRoom });
  } catch (error: any) {
    console.error("[joinRoom] Error:", error);
    return res.status(500).json({
      message: "Error al unirse a la sala",
      error: error.message,
    });
  }
};

// ───────────────
// Obtener estado de sala
// ───────────────
export const getRoomState = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    if (!code?.trim()) return res.status(400).json({ message: "Código de sala requerido." });

    // 1️⃣ Intentar obtener del cache Redis
    const cached = await redis.get(`room:${code}:state`);
    if (cached) {
      try {
        const room = JSON.parse(cached);
        return res.status(200).json({ source: "cache", room });
      } catch {
        // Si el JSON está corrupto, lo eliminamos
        await redis.del(`room:${code}:state`);
      }
    }

    // 2️⃣ Fallback a DB
    const room = await Room.findOne({ code })
      .populate("players.userId", "name")
      .lean();

    if (!room) return res.status(404).json({ message: "Sala no encontrada." });

    // 3️⃣ Normalizar jugadores (en caso de valores nulos)
    const safePlayers = room.players.map((p: any) => ({
      userId:
        p.userId?._id?.toString() ||
        p.userId?.toString() ||
        null,
      name: p.userId?.name || p.name || "Unknown",
      joinedAt: p.joinedAt,
    }));

    // 4️⃣ Guardar nuevamente en cache
    const cacheData = {
      code: room.code,
      status: room.status,
      players: safePlayers,
      maxPlayers: room.maxPlayers,
      hostId: room.hostId,
    };
    await redis.setex(`room:${code}:state`, ROOM_CACHE_TTL, JSON.stringify(cacheData));

    return res.status(200).json({ source: "db", room: cacheData });
  } catch (error: any) {
    console.error("[getRoomState] Error:", error);
    return res.status(500).json({
      message: "Error obteniendo estado de la sala",
      error: error.message,
    });
  }
};