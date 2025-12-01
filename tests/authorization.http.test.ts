import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import express, { json } from "express";

import { Room } from "../src/models/room.model";
import { GameResult } from "../src/models/gameResult.model";
import * as roomController from "../src/controllers/room.controller";
import * as gameResultController from "../src/controllers/gameResult.controller";
import logger from "../src/utils/logger";

// Mock redis used by controllers
jest.mock("../src/config/redis", () => ({
  setex: jest.fn(),
  get: jest.fn(),
}));

describe("Authorization HTTP tests", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      // @ts-ignore
      await collections[key].deleteMany({});
    }
    jest.clearAllMocks();
  });

  it("GET /rooms/:code returns 403 and logs when authenticated user is not a player or host", async () => {
    const app = express();
    app.use(json());

    // middleware to set req.user from header 'x-user' (JSON)
    app.use((req, _res, next) => {
      const hdr = req.header("x-user");
      if (hdr) {
        try {
          (req as any).user = JSON.parse(hdr);
        } catch {}
      }
      next();
    });

    app.get("/rooms/:code", (req, res) => roomController.getRoomState(req as any, res));

    // Create a room where hostId is 'host1' and players contain only 'host1'
    const hostId = new mongoose.Types.ObjectId().toHexString();
    await new Room({ code: "ROOMX", hostId, triviaId: new mongoose.Types.ObjectId(), players: [{ userId: new mongoose.Types.ObjectId(hostId), name: "Host" }] }).save();

    const warnSpy = jest.spyOn(logger, "warn");

    // Make request authenticated as other user
    const otherUserId = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app).get("/rooms/ROOMX").set("x-user", JSON.stringify({ id: otherUserId }));

    expect(res.status).toBe(403);
    expect(warnSpy).toHaveBeenCalled();
    const calledWith = warnSpy.mock.calls[0][0];
    expect(calledWith).toHaveProperty("userId", otherUserId);
  });

  it("GET /game-results/:code returns 403 and logs when authenticated user is not a player or host", async () => {
    const app = express();
    app.use(json());

    app.use((req, _res, next) => {
      const hdr = req.header("x-user");
      if (hdr) {
        try {
          (req as any).user = JSON.parse(hdr);
        } catch {}
      }
      next();
    });

    app.get("/game-results/:code", (req, res) => gameResultController.getGameResultByRoom(req as any, res));

    const hostId = new mongoose.Types.ObjectId().toHexString();
    // Create room where hostId is hostId and no other players
    await new Room({ code: "GAMEX", hostId, triviaId: new mongoose.Types.ObjectId(), players: [{ userId: new mongoose.Types.ObjectId(hostId), name: "Host" }] }).save();

    // Create GameResult for that room
    await new GameResult({ roomCode: "GAMEX", triviaId: new mongoose.Types.ObjectId(), finishedAt: new Date(), players: [], scores: {}, winner: {} }).save();

    const warnSpy = jest.spyOn(logger, "warn");

    const otherUserId = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app).get("/game-results/GAMEX").set("x-user", JSON.stringify({ id: otherUserId }));

    expect(res.status).toBe(403);
    expect(warnSpy).toHaveBeenCalled();
    const calledWith = warnSpy.mock.calls[0][0];
    expect(calledWith).toHaveProperty("userId", otherUserId);
  });
});
