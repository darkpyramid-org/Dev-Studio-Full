import { Request, Response } from "express";
import { requireUser } from "../middleware/auth.js";
import { connectorsService } from "../../infrastructure/di/container.js";
import { logger } from "../../infrastructure/lib/logger.js";

export const getAll = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const data = await connectorsService.getAll(uid);
    res.json(data);
  } catch (error) {
    logger.error("[connectors] getAll error", { error, uid });
    res.status(500).json({ error: "Failed to fetch connectors", detail: (error as Error)?.message });
  }
};

export const create = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const result = await connectorsService.upsert(uid, req.body);
    res.json(result);
  } catch (error) {
    logger.error("[connectors] create error", { error, uid, body: req.body });
    res.status(500).json({ error: "Failed to create connector", detail: (error as Error)?.message });
  }
};

export const createBulk = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const items = Array.isArray(req.body) ? req.body : [];
    const result = await connectorsService.upsertBulk(uid, items);
    res.json(result);
  } catch (error) {
    logger.error("[connectors] createBulk error", { error, uid, count: Array.isArray(req.body) ? req.body.length : 0 });
    res.status(500).json({ error: "Failed to create bulk connectors", detail: (error as Error)?.message });
  }
};

export const deleteById = async (req: Request, res: Response) => {
  const uid = requireUser(req, res);
  if (!uid) return;
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await connectorsService.deleteById(uid, id);
    res.json({ ok: true });
  } catch (error) {
    logger.error("[connectors] deleteById error", { error, uid, id: req.params.id });
    res.status(500).json({ error: "Failed to delete connector", detail: (error as Error)?.message });
  }
};
