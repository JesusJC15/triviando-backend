import express from "express";
import request from "supertest";
import { validateBody, validateParams } from "../src/middleware/validate";

describe("validate middleware - non ZodError branches", () => {
  it("validateBody returns generic 400 when parse throws non-ZodError", async () => {
    const fakeSchema = { parse: jest.fn().mockImplementation(() => { throw new Error("boom"); }) } as any;
    const app = express();
    app.use(express.json());
    app.post("/test", validateBody(fakeSchema), (req, res) => res.status(200).json({ ok: true }));

    const res = await request(app).post("/test").send({});
    expect(res.status).toBe(400);
    expect(res.body.details[0].message).toMatch(/boom/);
  });

  it("validateParams returns generic 400 when parse throws non-ZodError", async () => {
    const fakeSchema = { parse: jest.fn().mockImplementation(() => { throw new Error("param fail"); }) } as any;
    const app = express();
    app.get("/test/:id", validateParams(fakeSchema), (req, res) => res.status(200).json({ ok: true }));

    const res = await request(app).get("/test/123");
    expect(res.status).toBe(400);
    expect(res.body.details[0].message).toMatch(/param fail/);
  });
});
