import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import logger from "../utils/logger";

export async function socketAuthMiddleware(socket: Socket, next: (err?: any) => void) {
  try {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers["authorization"] as string)?.replace("Bearer ", "");

    if (!token) {
      const e = new Error("Not authenticated");
      (e as any).status = 401;
      return next(e);
    }

    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(payload.id).select("_id name email").lean();

    if (!user) {
      logger.warn({ socketId: socket.id, addr: socket.handshake.address }, "Socket auth - user not found");
      const e = new Error("User not found");
      (e as any).status = 401;
      return next(e);
    }

    socket.data.user = { id: user._id.toString(), name: user.name };
    next();
  } catch (err: any) {
    logger.warn({ socketId: socket.id, addr: socket.handshake.address, err: err?.message || err }, "Socket authentication error");
    const e = new Error("Authentication error");
    (e as any).status = 401;
    next(e);
  }
}