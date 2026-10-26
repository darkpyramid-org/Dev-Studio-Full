import { StateCreator } from "zustand";
import { ForgeState } from "../types";
import * as db from "@/lib/api";
import { createCrudActions } from "../crud.factory";

export const createIntegrationSlice: StateCreator<
  ForgeState,
  [["zustand/persist", unknown]],
  [],
  Partial<ForgeState>
> = (set, get) => {
  const connector = createCrudActions(set, get, {
    label: "Connector",
    getList: (s) => s.connectors,
    setList: (list) => ({ connectors: list }),
    apiUpsert: db.upsertConnector,
    apiDelete: db.deleteConnector,
  });

  const socialDraft = createCrudActions(set, get, {
    label: "Draft",
    getList: (s) => s.socialDrafts,
    setList: (list) => ({ socialDrafts: list }),
    apiUpsert: db.upsertSocialDraft,
    apiDelete: db.deleteSocialDraft,
  });

  const mailTemplate = createCrudActions(set, get, {
    label: "Mail template",
    getList: (s) => s.mailTemplates,
    setList: (list) => ({ mailTemplates: list }),
    apiUpsert: db.upsertMailTemplate,
    apiDelete: db.deleteMailTemplate,
  });

  return {
    upsertConnector: connector.upsert,
    deleteConnector: connector.remove,

    upsertSocialDraft: socialDraft.upsert,
    deleteSocialDraft: socialDraft.remove,

    upsertMailTemplate: mailTemplate.upsert,
    deleteMailTemplate: mailTemplate.remove,
  };
};
