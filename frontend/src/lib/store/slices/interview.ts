import { StateCreator } from "zustand";
import { ForgeState } from "../types";
import * as db from "@/lib/api";
import { createCrudActions } from "../crud.factory";

export const createInterviewSlice: StateCreator<
  ForgeState,
  [["zustand/persist", unknown]],
  [],
  Partial<ForgeState>
> = (set, get) => {
  const { upsert, remove } = createCrudActions(set, get, {
    label: "Question",
    getList: (s) => s.interviewQuestions,
    setList: (list) => ({ interviewQuestions: list }),
    apiUpsert: (q) => db.upsertInterviewQuestion({ ...q, isGlobal: false }),
    apiDelete: db.deleteInterviewQuestion,
  });

  return {
    upsertInterviewQuestion: upsert,
    deleteInterviewQuestion: remove,
    toggleFavoriteInterviewQuestion: async (id) => {
      const q = get().interviewQuestions.find((x) => x.id === id);
      if (q) await upsert({ ...q, favorite: !q.favorite });
    },
    toggleProgress: async (itemId, areaId) => {
      const current = !!get().userProgress[itemId];
      set((s) => ({ userProgress: { ...s.userProgress, [itemId]: !current } }));
      try {
        await db.toggleProgress(itemId, areaId, !current);
      } catch (err) {
        console.error("Toggle progress error:", err);
        set((s) => ({ userProgress: { ...s.userProgress, [itemId]: current } }));
      }
    },
  };
};
