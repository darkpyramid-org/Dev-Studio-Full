import { StateCreator } from "zustand";
import { ForgeState } from "../types";
import * as db from "@/lib/api";
import { createCrudActions } from "../crud.factory";

export const createAgentSlice: StateCreator<
  ForgeState,
  [["zustand/persist", unknown]],
  [],
  Partial<ForgeState>
> = (set, get) => {
  const { upsert, remove } = createCrudActions(set, get, {
    label: "Agent",
    getList: (s) => s.agents,
    setList: (list) => ({ agents: list }),
    apiUpsert: (a) =>
      db.upsertAgent({ ...a, system_prompt: a.systemPrompt, user_id: "" } as any),
    apiDelete: db.deleteAgent,
  });

  return {
    upsertAgent: upsert,
    deleteAgent: remove,
  };
};
