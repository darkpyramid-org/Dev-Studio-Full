import {
  BarChart2,
  Sparkles,
  Plus,
  Building,
  MapPin,
  Link2,
  Percent,
  CheckCircle2,
  Globe,
  ExternalLink,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Connector } from "@/types/tools";
import { parsePlatformConnector } from "../platform-helpers";
import { StatusBadge, RegionBadge } from "./platform-badges";

export interface PlatformTableViewProps {
  platforms: Connector[];
  totalCount: number;
  onSelectPlatform: (id: string) => void;
  onDeletePlatform: (id: string) => void;
  onNewPlatform: () => void;
  onLoadPresets: () => void;
  searchQuery?: string;
  selectedRegion?: string;
}

export function PlatformTableView({
  platforms,
  totalCount,
  onSelectPlatform,
  onDeletePlatform,
  onNewPlatform,
  onLoadPresets,
  searchQuery,
  selectedRegion,
}: PlatformTableViewProps) {
  const activeCount = platforms.filter(
    (c) => parsePlatformConnector(c).status === "active"
  ).length;
  const globalCount = platforms.filter(
    (c) => parsePlatformConnector(c).regionCode === "global"
  ).length;
  const egCount = platforms.filter(
    (c) => parsePlatformConnector(c).regionCode === "eg"
  ).length;
  const saCount = platforms.filter(
    (c) => parsePlatformConnector(c).regionCode === "sa"
  ).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Table header bar pinned to top */}
      <div className="px-5 py-3.5 sm:px-8 border-b border-border/60 bg-muted/20 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="size-4 text-primary" />
          <h2 className="text-base font-semibold">Platforms &amp; Sites</h2>
          <span className="text-[11px] font-mono text-muted-foreground ml-1">
            ({platforms.length})
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={onLoadPresets}
            className="text-xs h-8 border-primary/30 text-primary hover:bg-primary/10"
          >
            <Sparkles className="size-3.5 mr-1" />
            Load Presets
          </Button>
          <Button
            size="sm"
            onClick={onNewPlatform}
            className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Plus className="size-3.5 mr-1" />
            New Platform
          </Button>
        </div>
      </div>

      {/* Table scroll container - scrollbar is placed right along the edge of the main panel */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur-xs border-b border-border">
            <tr className="bg-muted/40">
              <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-[36px]">
                #
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Building className="size-3.5" />
                  Platform
                </span>
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  Region
                </span>
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                <span className="flex items-center gap-1.5">
                  <Link2 className="size-3.5" />
                  Website
                </span>
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                <span className="flex items-center gap-1.5">
                  <Percent className="size-3.5" />
                  Commission
                </span>
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5" />
                  Status
                </span>
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-[90px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {platforms.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-muted-foreground text-sm">
                  <Globe className="size-8 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">No platforms found</p>
                  {(searchQuery || selectedRegion !== "all") && (
                    <p className="text-xs mt-1 opacity-60">Try adjusting your filters</p>
                  )}
                </td>
              </tr>
            ) : (
              platforms.map((c, index) => {
                const parsed = parsePlatformConnector(c);
                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectPlatform(c.id)}
                    className="hover:bg-muted/30 cursor-pointer transition-colors group"
                  >
                    {/* Index */}
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground/60">
                      {index + 1}
                    </td>

                    {/* Platform name + details */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        <span>{parsed.name}</span>
                        {parsed.arabicName && (
                          <span className="text-xs text-muted-foreground font-normal">
                            ({parsed.arabicName})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground/80 truncate max-w-[280px]">
                        {parsed.bestFor}
                      </div>
                    </td>

                    {/* Region */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <RegionBadge regionCode={parsed.regionCode} />
                    </td>

                    {/* Website */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      {parsed.url && parsed.url !== "https://" ? (
                        <a
                          href={parsed.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 font-mono"
                        >
                          {parsed.url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
                          <ExternalLink className="size-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground/40">—</span>
                      )}
                    </td>

                    {/* Commission */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs font-mono text-muted-foreground">
                        {parsed.commission || "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <StatusBadge status={parsed.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-muted-foreground hover:text-foreground"
                          title="View details"
                          onClick={() => onSelectPlatform(c.id)}
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Delete"
                          onClick={() => onDeletePlatform(c.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer stats pinned to bottom */}
      {platforms.length > 0 && (
        <div className="px-5 py-2.5 sm:px-8 border-t border-border/60 bg-muted/20 shrink-0 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <span>
            {activeCount} active &nbsp;·&nbsp;
            {globalCount} global &nbsp;·&nbsp;
            {egCount} eg &nbsp;·&nbsp;
            {saCount} sa
          </span>
          <span>{totalCount} total platforms</span>
        </div>
      )}
    </div>
  );
}
