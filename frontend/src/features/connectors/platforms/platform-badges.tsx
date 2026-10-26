import { Globe, CheckCircle2, Star, Clock, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: "active" | "top_rated" | "applied" | "exploring" | "pending";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="size-2.5 text-emerald-500" />
          Active
        </span>
      );
    case "top_rated":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Star className="size-2.5 text-amber-500 fill-amber-500" />
          Top Rated
        </span>
      );
    case "applied":
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <Clock className="size-2.5 text-sky-500" />
          Pending
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border">
          <Compass className="size-2.5" />
          Exploring
        </span>
      );
  }
}

export interface RegionBadgeProps {
  regionCode: "global" | "eg" | "sa";
}

export function RegionBadge({ regionCode }: RegionBadgeProps) {
  if (regionCode === "eg") {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#CE1126]/10 text-[#CE1126] dark:text-red-400 border border-[#CE1126]/30">
        <span className="size-1.5 rounded-full bg-[#CE1126]" />
        Egypt
      </span>
    );
  }
  if (regionCode === "sa") {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#006C35]/10 text-[#006C35] dark:text-emerald-400 border border-[#006C35]/30">
        <span className="size-1.5 rounded-full bg-[#006C35]" />
        Saudi Arabia
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
      <Globe className="size-3 text-sky-500" />
      Global
    </span>
  );
}

export interface RegionIconProps {
  regionCode: "global" | "eg" | "sa";
  className?: string;
}

export function RegionIcon({ regionCode, className = "size-3.5" }: RegionIconProps) {
  if (regionCode === "eg") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center font-bold text-[8px] leading-none px-1 py-0.5 rounded bg-[#CE1126] text-white shrink-0 tracking-tight",
          className
        )}
        title="Egypt"
      >
        EG
      </span>
    );
  }
  if (regionCode === "sa") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center font-bold text-[8px] leading-none px-1 py-0.5 rounded bg-[#006C35] text-white shrink-0 tracking-tight",
          className
        )}
        title="Saudi Arabia"
      >
        SA
      </span>
    );
  }
  return <Globe className={cn("text-sky-500 shrink-0", className)} />;
}

export function regionLabel(regionCode: "global" | "eg" | "sa"): string {
  if (regionCode === "eg") return "Egypt";
  if (regionCode === "sa") return "Saudi Arabia";
  return "Global";
}
