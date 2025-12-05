import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { register, login, me, refreshToken, logout } from "../src/controllers/auth.controller";
import User from "../src/models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

jest.mock("../src/models/user.model");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../src/utils/passwordUtils");

import { hashPassword, comparePassword } from "../src/utils/passwordUtils";

const app = express();
app.use(express.json());
app.post("/api/v1/auth/register", register);
app.post("/api/v1/auth/login", login);

describe("🧩 Auth Endpoints (mockeados)", () => {
  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    name: "Test",
    email: "test@example.com",
    password: "hashedPassword",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ should register a new user", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (hashPassword as jest.Mock).mockResolvedValue("hashedPassword");
    (User.create as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Test", email: "test@example.com", password: "Test123!" });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("test@example.com");
  });

  it("🚫 should prevent duplicate email registration", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Test", email: "test@example.com", password: "Test123!" });

    expect(res.status).toBe(400);
    // ✅ Ajuste al texto real de tu backend
    expect(res.body.message).toMatch(/email already registered/i);
  });

  it("🔐 should login successfully", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token");

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "Test123!" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token", "fake-jwt-token");
  });

  it("❌ should fail login with wrong password", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockResolvedValue(false);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "wrongPass" });

    expect(res.status).toBe(400);
    // ✅ Ajuste al texto real de tu backend
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it("👤 should return current user with me", async () => {
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue({ _id: mockUser._id, name: mockUser.name, email: mockUser.email }),
    });

    const appMe = express();
    appMe.use(express.json());
    appMe.get(
      "/api/v1/auth/me",
      (req, res, next) => {
        (req as any).user = { id: mockUser._id.toString() };
        next();
      },
      me
    );

    const res = await request(appMe).get("/api/v1/auth/me");
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(mockUser.email);
  });

  it("🔄 should refresh token", async () => {
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue({ _id: mockUser._id, name: mockUser.name, email: mockUser.email }),
    });
    (jwt.sign as jest.Mock).mockReturnValue("refreshed-token");

    const appRef = express();
    appRef.use(express.json());
    appRef.post(
      "/api/v1/auth/refresh",
      (req, res, next) => {
        (req as any).user = { id: mockUser._id.toString() };
        next();
      },
      refreshToken
    );

    const res = await request(appRef).post("/api/v1/auth/refresh");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token", "refreshed-token");
    expect(res.body.user.email).toBe(mockUser.email);
  });

  it("🚪 should logout successfully", async () => {
    const appOut = express();
    appOut.use(express.json());
    appOut.post(
      "/api/v1/auth/logout",
      (req, res, next) => {
        (req as any).user = { id: mockUser._id.toString() };
        next();
      },
      logout
    );

    const res = await request(appOut).post("/api/v1/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/logged out/i);
  });

  it("🛑 register forwards error to next when hashing fails", async () => {
    const req = { body: { name: "X", email: "x@x.com", password: "p" } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (hashPassword as jest.Mock).mockRejectedValue(new Error("hash failed"));

    await register(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("🔍 login returns 400 when user not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "noone@example.com", password: "p" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it("🛑 login forwards error to next when comparePassword throws", async () => {
    const req = { body: { email: "a@b.com", password: "p" } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockRejectedValue(new Error("cmp fail"));

    await login(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("🙅 me returns 401 when no payload", async () => {
    const appMe = express();
    appMe.use(express.json());
    appMe.get("/api/v1/auth/me", me);

    const res = await request(appMe).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/user not authenticated/i);
  });

  it("🚫 me returns 404 when user not found", async () => {
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null),
    });

    const appMe = express();
    appMe.use(express.json());
    appMe.get(
      "/api/v1/auth/me",
      (req, res, next) => {
        (req as any).user = { id: new mongoose.Types.ObjectId().toString() };
        next();
      },
      me
    );

    const res = await request(appMe).get("/api/v1/auth/me");
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/user not found/i);
  });

  it("🔒 refresh returns 401 when no payload", async () => {
    const appRef = express();
    appRef.use(express.json());
    appRef.post("/api/v1/auth/refresh", refreshToken);

    const res = await request(appRef).post("/api/v1/auth/refresh");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/user not authenticated/i);
  });

  it("🚫 refresh returns 404 when user not found", async () => {
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null),
    });

    const appRef = express();
    appRef.use(express.json());
    appRef.post(
      "/api/v1/auth/refresh",
      (req, res, next) => {
        (req as any).user = { id: new mongoose.Types.ObjectId().toString() };
        next();
      },
      refreshToken
    );

    const res = await request(appRef).post("/api/v1/auth/refresh");
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/user not found/i);
  });
});