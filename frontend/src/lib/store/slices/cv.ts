import { StateCreator } from "zustand";
import { ForgeState } from "../types";
import * as db from "@/lib/api";
import { createCrudActions } from "../crud.factory";

export const createCVSlice: StateCreator<
  ForgeState,
  [["zustand/persist", unknown]],
  [],
  Partial<ForgeState>
> = (set, get) => {
  const { upsert, remove } = createCrudActions(set, get, {
    label: "CV",
    getList: (s) => s.cvProfiles,
    setList: (list) => ({ cvProfiles: list }),
    apiUpsert: db.upsertCVProfile,
    apiDelete: db.deleteCVProfile,
  });

  return {
    cvProfiles: [],
    upsertCVProfile: upsert,
    deleteCVProfile: remove,
  };
};
