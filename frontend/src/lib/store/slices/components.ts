import { StateCreator } from "zustand";
import { ForgeState } from "../types";
import * as db from "@/lib/api";
import { createCrudActions } from "../crud.factory";

export const createComponentSlice: StateCreator<
  ForgeState,
  [["zustand/persist", unknown]],
  [],
  Partial<ForgeState>
> = (set, get) => {
  const component = createCrudActions(set, get, {
    label: "Component",
    getList: (s) => s.components,
    setList: (list) => ({ components: list }),
    apiUpsert: (c) =>
      db.upsertComponent({ ...c, usage_count: c.usageCount, user_id: "" } as any),
    apiDelete: db.deleteComponent,
  });

  const snippet = createCrudActions(set, get, {
    label: "Snippet",
    getList: (s) => s.snippets,
    setList: (list) => ({ snippets: list }),
    apiUpsert: (s) => db.upsertSnippet({ ...s, user_id: "" } as any),
    apiDelete: db.deleteSnippet,
  });

  const template = createCrudActions(set, get, {
    label: "Template",
    getList: (s) => s.templates,
    setList: (list) => ({ templates: list }),
    apiUpsert: (t) => db.upsertTemplate({ ...t, user_id: "" } as any),
    apiDelete: db.deleteTemplate,
  });

  return {
    upsertComponent: component.upsert,
    deleteComponent: component.remove,
    toggleFavoriteComponent: async (id) => {
      const c = get().components.find((x) => x.id === id);
      if (c) await component.upsert({ ...c, favorite: !c.favorite });
    },

    upsertSnippet: snippet.upsert,
    deleteSnippet: snippet.remove,

    upsertTemplate: template.upsert,
    deleteTemplate: template.remove,
  };
};
