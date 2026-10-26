import { createRequire } from "module";

const require = createRequire(import.meta.url);

interface RawSkillArea {
  id: string;
  label: string;
  iconName?: string;
  description: string;
  concepts: unknown[];
  resources: unknown[];
  checklist: unknown[];
  subAreasLabel?: string;
  subAreas?: unknown[];
}

interface SkillAreasData {
  tech: Record<string, RawSkillArea>;
  soft: RawSkillArea;
}

let loadedData: SkillAreasData = { tech: {}, soft: { id: "soft", label: "Soft Skills", description: "", concepts: [], resources: [], checklist: [] } };
try {
  loadedData = require("./skill-areas.json");
} catch (err) {
  console.warn("[skill-areas] Warning: Could not load skill-areas.json, using fallback", err);
}

export const skillAreasData: SkillAreasData = loadedData;
