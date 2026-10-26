import { Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Connector } from "@/types/tools";
import { parsePlatformConnector } from "../platform-helpers";
import { RegionIcon, StatusBadge, regionLabel } from "./platform-badges";
import {
  InnerSidebar,
  InnerSidebarHeader,
  InnerSidebarSearch,
  InnerSidebarFilters,
  InnerSidebarDivider,
  InnerSidebarList,
  InnerSidebarItem,
  InnerSidebarEmpty,
  InnerSidebarAddButton,
} from "@/components/layout";

export interface PlatformSidebarProps {
  totalCount: number;
  filteredPlatforms: Connector[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onLoadPresets: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRegion: string;
  onRegionChange: (r: string) => void;
  regionFilters: { label: string; value: string; count: number }[];
}

export function PlatformSidebar({
  totalCount,
  filteredPlatforms,
  activeId,
  onSelect,
  onDelete,
  onNew,
  onLoadPresets,
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  regionFilters,
}: PlatformSidebarProps) {
  return (
    <InnerSidebar>
      <InnerSidebarHeader
        icon={<Globe className="size-3.5" />}
        title="Platforms"
        count={totalCount}
        onAdd={onNew}
        addLabel="New Platform"
      />

      <InnerSidebarSearch
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search platforms, regions..."
      />

      <div className="pt-1.5 pb-1">
        <InnerSidebarFilters
          wrap={false}
          filters={regionFilters}
          active={selectedRegion}
          onChange={onRegionChange}
        />
      </div>

      <InnerSidebarDivider />

      {/* Presets loader banner if empty or few */}
      {totalCount < 10 && (
        <div className="p-2 border-b border-border/40 bg-primary/5">
          <Button
            size="sm"
            variant="outline"
            onClick={onLoadPresets}
            className="w-full text-xs font-medium flex items-center justify-center gap-1.5 h-8 border-primary/30 text-primary hover:bg-primary/10"
          >
            <Sparkles className="size-3.5" /> Load All 22 Presets
          </Button>
        </div>
      )}

      {/* Platforms list */}
      <InnerSidebarList>
        {filteredPlatforms.length === 0 ? (
          <div className="p-3 text-center">
            <InnerSidebarEmpty
              message={
                searchQuery || selectedRegion !== "all"
                  ? "No matching platforms"
                  : "No platforms yet"
              }
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={onLoadPresets}
              className="mt-3 text-xs w-full"
            >
              <Sparkles className="size-3.5 mr-1.5" /> Load 22 Presets
            </Button>
          </div>
        ) : (
          filteredPlatforms.map((c) => {
            const parsed = parsePlatformConnector(c);
            const isSelected = c.id === activeId;
            return (
              <InnerSidebarItem
                key={c.id}
                active={isSelected}
                onClick={() => onSelect(c.id)}
                onDelete={() => onDelete(c.id)}
              >
                <div className="flex items-center gap-2.5 w-full min-w-0">
                  <RegionIcon regionCode={parsed.regionCode} className="size-[14px] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs truncate">{parsed.name}</div>
                    <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                      {parsed.arabicName || regionLabel(parsed.regionCode)}
                    </div>
                    <div className="text-[9px] text-muted-foreground/60 mt-0.5 font-mono">
                      {parsed.commission}
                    </div>
                  </div>
                  <StatusBadge status={parsed.status} />
                </div>
              </InnerSidebarItem>
            );
          })
        )}
      </InnerSidebarList>

      <InnerSidebarAddButton onClick={onNew} label="New Platform" />
    </InnerSidebar>
  );
}
