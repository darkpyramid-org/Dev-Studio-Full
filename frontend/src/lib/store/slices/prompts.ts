import { StateCreator } from "zustand";
import { ForgeState } from "../types";
import * as db from "@/lib/api";
import { createCrudActions } from "../crud.factory";

export const createPromptSlice: StateCreator<
  ForgeState,
  [["zustand/persist", unknown]],
  [],
  Partial<ForgeState>
> = (set, get) => {
  const { upsert, remove } = createCrudActions(set, get, {
    label: "Prompt",
    getList: (s) => s.prompts,
    setList: (list) => ({ prompts: list }),
    apiUpsert: db.upsertPrompt,
    apiDelete: db.deletePrompt,
    toPayload: ({ usageCount, ...prompt }) => ({
      ...prompt,
      usage_count: usageCount,
      user_id: "",
    }),
  });

  return {
    upsertPrompt: upsert,
    deletePrompt: remove,
    toggleFavoritePrompt: async (id) => {
      const p = get().prompts.find((x) => x.id === id);
      if (p) await upsert({ ...p, favorite: !p.favorite });
    },
    incrementPromptUsage: async (id) => {
      const p = get().prompts.find((x) => x.id === id);
      if (p) await upsert({ ...p, usageCount: (p.usageCount || 0) + 1 });
    },
  };
};
