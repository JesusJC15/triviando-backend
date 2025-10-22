import { Request, Response } from "express";
import { Room, generateUniqueRoomCode } from "../models/room.model";
import { Trivia } from "../models/trivia.model";
import { generateQuestions } from "../services/aiGenerator.service";
import { Types } from "mongoose";
import redis from "../config/redis";
import User from "../models/user.model";

const ROOM_CACHE_TTL = 120; // segundos

export const createRoom = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });

    const { topic, maxPlayers = 4, quantity = 5 } = req.body;

    if (!topic || topic.trim() === "") {
      return res.status(400).json({ message: "Debes enviar un tema válido." });
    }

    if (quantity < 5 || quantity > 20) {
      return res.status(400).json({ message: "Cantidad de preguntas inválida (5–20)." });
    }

    // 1️⃣ Crear la trivia
    const questions = await generateQuestions(topic, quantity);

    const trivia = new Trivia({
      topic,
      questions,
      creator: user.id,
    });
    await trivia.save();

    // 2️⃣ Generar código único de sala
    const code = await generateUniqueRoomCode();

    // 3️⃣ Obtener nombre del usuario
    const userDoc = await User.findById(user.id).select("name").lean();
    const player = {
      userId: user.id,
      name: userDoc?.name || "Anonymous",
      joinedAt: new Date(),
    };

    // 4️⃣ Crear la sala
    const room = new Room({
      code,
      hostId: user.id,
      triviaId: trivia._id,
      maxPlayers,
      players: [player],
    });
    await room.save();

    // 5️⃣ Cachear en Redis
    await redis.setex(`room:${room.code}:state`, ROOM_CACHE_TTL, JSON.stringify(room));

    return res.status(201).json({
      message: "Sala creada exitosamente 🎉",
      roomId: room._id,
      code: room.code,
      triviaId: trivia._id,
      maxPlayers: room.maxPlayers,
      host: player.name,
    });

  } catch (error: any) {
    console.error("createRoom error:", error);
    return res.status(500).json({
      message: "Error creando la sala",
      error: error.message,
    });
  }
};

export const getRoomState = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    // 1️⃣ Revisar cache Redis
    const cached = await redis.get(`room:${code}:state`);
    if (cached) {
      return res.status(200).json({ source: "cache", room: JSON.parse(cached) });
    }

    // 2️⃣ Buscar sala en DB
    const room = await Room.findOne({ code }).populate("players.userId", "name").lean();
    if (!room) return res.status(404).json({ message: "Room not found" });

    // 3️⃣ Cachear en Redis
    await redis.setex(`room:${code}:state`, ROOM_CACHE_TTL, JSON.stringify(room));

    return res.status(200).json({ source: "db", room });

  } catch (error: any) {
    console.error("getRoomState error:", error);
    return res.status(500).json({
      message: "Error obteniendo estado de la sala",
      error: error.message,
    });
  }
};