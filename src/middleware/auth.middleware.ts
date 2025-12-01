import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../utils/logger";

export interface AuthRequest extends Request {
  user?: JwtPayload | string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn({ ip: req.ip, path: req.originalUrl }, "Missing or malformed Authorization header");
    return res.status(401).json({ message: "Token not provided or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not configured");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    logger.warn({ ip: req.ip, path: req.originalUrl, err: err?.message || err }, "Token verification failed");
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};