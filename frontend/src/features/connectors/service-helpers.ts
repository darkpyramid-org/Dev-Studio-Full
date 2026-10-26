import type { Connector } from "@/types/tools";
import { PRESET_SERVICES } from "@/constants/services-presets";
import {
  Search,
  Globe,
  Smartphone,
  ShieldCheck,
  Palette,
  Zap,
  Server,
  CreditCard,
  Sparkles,
  Languages,
  Accessibility,
  MousePointerClick,
  Link2,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface ParsedService {
  id: string;
  name: string;
  category: string;
  budget: string;
  pricingType: "fixed" | "hourly" | "monthly" | "starting_at";
  deliveryTime: string;
  description: string;
  whatICanDo: string[];
  tags: string[];
  updatedAt: number;
}

export function parseServiceConnector(c: Connector): ParsedService {
  let description = "";
  let whatICanDo: string[] = [];
  // Only use c.email as budget if it's not actually an email address
  let budget = c.email && !c.email.includes("@") ? c.email : "";
  let deliveryTime = c.phone || "";
  let pricingType: "fixed" | "hourly" | "monthly" | "starting_at" = "fixed";

  if (c.notes) {
    const trimmed = c.notes.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed.description === "string") description = parsed.description;
        if (Array.isArray(parsed.whatICanDo)) whatICanDo = parsed.whatICanDo;
        if (parsed.budget && !parsed.budget.includes("@")) budget = parsed.budget;
        if (parsed.deliveryTime) deliveryTime = parsed.deliveryTime;
        if (parsed.pricingType) pricingType = parsed.pricingType;
      } catch {
        // Fallback to text parsing
      }
    }

    if (!whatICanDo.length && !description) {
      // Parse markdown/plain text notes
      const lines = c.notes.split("\n");
      const bullets: string[] = [];
      const textLines: string[] = [];

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ") || trimmedLine.match(/^\d+\.\s/)) {
          bullets.push(trimmedLine.replace(/^[-*]\s+|\d+\.\s+/, ""));
        } else if (trimmedLine.length > 0) {
          textLines.push(trimmedLine);
        }
      }

      whatICanDo = bullets;
      description = textLines.join("\n");
    }
  }

  // If still missing whatICanDo, check if matching preset exists
  if (whatICanDo.length === 0) {
    const preset = PRESET_SERVICES.find(
      (p) =>
        p.name.toLowerCase() === (c.name || "").toLowerCase() ||
        (c.name || "").toLowerCase().includes(p.id) ||
        p.id === c.name?.toLowerCase().replace(/[^a-z]/g, "")
    );
    if (preset) {
      whatICanDo = [...preset.whatICanDo];
      if (!description) description = preset.description;
      if (!budget) budget = preset.budget;
      if (!deliveryTime) deliveryTime = preset.deliveryTime;
    }
  }

  return {
    id: c.id,
    name: c.name || "Untitled Service",
    category: c.category || "General Services",
    budget: budget || "$500 - $1,000",
    pricingType,
    deliveryTime: deliveryTime || "3 - 5 business days",
    description: description || "Professional service offering tailored for high-quality production deliverables.",
    whatICanDo: whatICanDo.length > 0 ? whatICanDo : ["Full requirements scoping and initial architecture design", "Production implementation and iterative review", "Testing, verification, and final client sign-off"],
    tags: Array.isArray(c.tags) && c.tags.length > 0 ? c.tags : ["Web Development"],
    updatedAt: c.updatedAt || Date.now(),
  };
}

export function serializeServiceConnector(
  service: ParsedService,
  existingCreatedAt?: number
): Connector {
  const notesPayload = JSON.stringify({
    description: service.description,
    whatICanDo: service.whatICanDo,
    budget: service.budget,
    pricingType: service.pricingType,
    deliveryTime: service.deliveryTime,
  });

  return {
    id: service.id,
    type: "services",
    name: service.name,
    category: service.category,
    email: service.budget,
    phone: service.deliveryTime,
    notes: notesPayload,
    tags: service.tags,
    createdAt: existingCreatedAt || Date.now(),
    updatedAt: Date.now(),
  };
}

export function getServiceIcon(name: string, category: string): LucideIcon {
  const n = (name || "").toLowerCase();
  const c = (category || "").toLowerCase();

  if (n.includes("seo") || n.includes("search")) return Search;
  if (n.includes("domin") || n.includes("domain") || n.includes("dns")) return Globe;
  if (n.includes("responsive") || n.includes("mobile")) return Smartphone;
  if (n.includes("security") || n.includes("audit") || n.includes("vulnerab")) return ShieldCheck;
  if (n.includes("ui") || n.includes("ux") || n.includes("design") || n.includes("figma")) return Palette;
  if (n.includes("landing") || n.includes("conversion")) return Zap;
  if (n.includes("server") || n.includes("devops") || n.includes("docker") || n.includes("cloud")) return Server;
  if (n.includes("payment") || n.includes("stripe") || n.includes("checkout")) return CreditCard;
  if (n.includes("ai") || n.includes("agent") || n.includes("llm")) return Sparkles;
  if (n.includes("lang") || n.includes("i18n") || n.includes("localiz")) return Languages;
  if (n.includes("access") || n.includes("a11y") || n.includes("wcag")) return Accessibility;
  if (n.includes("usability") || n.includes("heuristic")) return MousePointerClick;
  if (n.includes("backlink") || n.includes("link")) return Link2;
  if (n.includes("view") || n.includes("traffic") || n.includes("growth")) return TrendingUp;

  if (c.includes("marketing")) return TrendingUp;
  if (c.includes("design")) return Palette;
  if (c.includes("security")) return ShieldCheck;
  if (c.includes("infrastructure") || c.includes("devops")) return Server;
  if (c.includes("ai")) return Sparkles;

  return Wrench;
}
