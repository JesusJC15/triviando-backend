import http from "http";
import app from "./app";
import { initSocketServer } from "./socket";
import dotenv from "dotenv";
dotenv.config();
import logger from "./utils/logger";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
initSocketServer(server);

server.listen(PORT, () => {
  logger.info({ port: PORT }, `🚀 Server running`);
});