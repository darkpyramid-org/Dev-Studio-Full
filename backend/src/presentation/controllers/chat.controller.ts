import { Request, Response } from "express";
import { requireUser } from "../middleware/auth.js";
import { chatService } from "../../infrastructure/di/container.js";

export const create = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;

  try {
    const { prompt, systemPrompt, config } = req.body;
    const reply = await chatService.createChatCompletion(
      prompt,
      systemPrompt,
      config,
    );
    res.json({ reply });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res
      .status(errorMessage === "prompt is required" ? 400 : 500)
      .json({ error: errorMessage });
  }
};
