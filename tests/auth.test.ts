import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth Endpoints", () => {
  const user = { name: "Test", email: "test@example.com", password: "Test123!" };

  it("should register a user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(user.email);
  });

  it("should prevent duplicate email registration", async () => {
    const res = await request(app).post("/api/v1/auth/register").send(user);
    expect(res.statusCode).toBe(400);
  });

  it("should login successfully", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});