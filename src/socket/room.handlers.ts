import { Server, Socket } from "socket.io";
import { Room, generateUniqueRoomCode } from "../models/room.model";
import { Trivia } from "../models/trivia.model";
import User from "../models/user.model";
import { generateQuestions } from "../services/aiGenerator.service";
import { addChatMessage, getChatHistory } from "../utils/redisChat";

export function registerRoomHandlers(io: Server, socket: Socket) {
  let currentRoom: string | null = null;

  // ───── CREAR SALA + TRIVIA ─────
  socket.on("room:create", async ({ topic, maxPlayers = 4, quantity = 5 }, ack) => {
    try {
      const user = socket.data.user;
      if (!topic || topic.trim() === "") return ack?.({ ok: false, message: "Topic required" });

      // 1️⃣ Crear trivia automáticamente
      const questions = await generateQuestions(topic, quantity);
      const trivia = new Trivia({ topic, questions, creator: user.id });
      await trivia.save();

      // 2️⃣ Generar código único de sala
      const code = await generateUniqueRoomCode();

      // 3️⃣ Obtener nombre del usuario
      const userDoc = await User.findById(user.id).select("name").lean();
      const player = { userId: user.id, name: userDoc?.name || "Anonymous", joinedAt: new Date() };

      // 4️⃣ Crear sala
      const room = new Room({
        code,
        hostId: user.id,
        triviaId: trivia._id,
        maxPlayers,
        players: [player],
      });
      await room.save();

      socket.join(code);
      currentRoom = code;

      // 5️⃣ Devolver estado al host
      ack?.({
        ok: true,
        room: {
          code,
          roomId: room._id,
          triviaId: trivia._id,
          maxPlayers,
          host: player.name,
          players: room.players,
          chatHistory: [],
        },
      });

      // 6️⃣ Notificar a otros sockets (si aplica)
      io.to(code).emit("room:update", { event: "roomCreated", code, roomId: room._id });
    } catch (err: any) {
      console.error("room:create error:", err);
      ack?.({ ok: false, error: err.message });
    }
  });

  // ───── UNIRSE A SALA ─────
  socket.on("room:join", async ({ code }, ack) => {
    try {
      const user = socket.data.user;
      const room = await Room.findOne({ code });
      if (!room) return ack?.({ ok: false, message: "Room not found" });

      // Agregar jugador si no existe
      const exists = room.players.some((p) => p.userId.toString() === user.id);
      if (!exists) {
        room.players.push({ userId: user.id, name: user.name, joinedAt: new Date() });
        await room.save();
      }

      socket.join(code);
      currentRoom = code;

      const chatHistory = await getChatHistory(code);

      // Notificar a todos en la sala
      io.to(code).emit("room:update", {
        event: "playerJoined",
        player: { id: user.id, name: user.name },
        players: room.players,
      });

      // Enviar estado solo al que se unió
      ack?.({ ok: true, room: { code, players: room.players, chatHistory } });
    } catch (err: any) {
      console.error("room:join error:", err);
      ack?.({ ok: false, error: err.message });
    }
  });

  // ───── CHAT ─────
  socket.on("room:chat", async ({ code, message }, ack) => {
    try {
      const user = socket.data.user;
      const chatMsg = { userId: user.id, user: user.name, message, timestamp: new Date() };
      await addChatMessage(code, chatMsg);
      io.to(code).emit("room:chat:new", chatMsg);
      ack?.({ ok: true });
    } catch (err: any) {
      console.error("room:chat error:", err);
      ack?.({ ok: false, error: err.message });
    }
  });

  // ───── RECONEXIÓN ─────
  socket.on("room:reconnect", async ({ code }, ack) => {
    try {
      if (!code) return ack?.({ ok: false, message: "Room code required" });
      const user = socket.data.user;
      const room = await Room.findOne({ code });
      if (!room) return ack?.({ ok: false, message: "Room not found" });

      socket.join(code);
      currentRoom = code;

      const chatHistory = await getChatHistory(code);
      ack?.({ ok: true, room: { code, players: room.players, chatHistory } });
    } catch (err: any) {
      console.error("room:reconnect error:", err);
      ack?.({ ok: false, error: err.message });
    }
  });

  // ───── DESCONECTAR ─────
  socket.on("disconnect", async () => {
    if (!currentRoom) return;
    const user = socket.data.user;
    io.to(currentRoom).emit("room:update", { event: "playerLeft", userId: user.id });
    console.log(`🔴 ${user.name} left ${currentRoom}`);
  });
}