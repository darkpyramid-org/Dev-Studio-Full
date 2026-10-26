import { describe, it, expect, vi, beforeEach } from "vitest";
import { create } from "../chat.controller.js";
import { Request, Response } from "express";

// Mock the openai infrastructure library
vi.mock("../../../infrastructure/lib/openai.js", () => {
  return {
    getOpenAI: vi.fn().mockReturnValue({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: "Hello from mock AI!",
                },
              },
            ],
          }),
        },
      },
    }),
  };
});

// Mock auth middleware
vi.mock("../../middleware/auth.js", () => ({
  requireUser: vi.fn((req, res) => {
    if (req.cookies?.ds_token) return "mock-user-123";
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }),
}));

describe("Chat Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnThis();
    req = {
      body: {},
      cookies: { ds_token: "valid-token" },
    };
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it("should return 401 if unauthenticated", async () => {
    req.cookies = {};
    await create(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Not authenticated" });
  });

  it("should return 400 error if prompt is missing", async () => {
    req.body = {};
    await create(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: "prompt is required" });
  });

  it("should return chat reply if prompt is present", async () => {
    req.body = { prompt: "Hello" };
    await create(req as Request, res as Response);
    expect(jsonMock).toHaveBeenCalledWith({ reply: "Hello from mock AI!" });
  });
});
