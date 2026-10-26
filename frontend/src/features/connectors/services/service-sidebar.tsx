import { Wrench, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Connector } from "@/types/tools";
import { parseServiceConnector, getServiceIcon } from "../service-helpers";
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

export interface ServiceSidebarProps {
  totalCount: number;
  filteredServices: Connector[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onLoadPresets: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
  categoryFilters: { label: string; value: string; count: number }[];
}

export function ServiceSidebar({
  totalCount,
  filteredServices,
  activeId,
  onSelect,
  onDelete,
  onNew,
  onLoadPresets,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categoryFilters,
}: ServiceSidebarProps) {
  return (
    <InnerSidebar>
      <InnerSidebarHeader
        icon={<Wrench className="size-3.5" />}
        title="Services"
        count={totalCount}
        onAdd={onNew}
        addLabel="New Service"
      />

      <InnerSidebarSearch
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search services..."
      />

      <div className="pt-1.5 pb-1">
        <InnerSidebarFilters
          wrap={true}
          filters={categoryFilters}
          active={selectedCategory}
          onChange={onCategoryChange}
        />
      </div>

      <InnerSidebarDivider />

      {/* Presets loader banner if empty or few */}
      {totalCount < 14 && (
        <div className="p-2 border-b border-border/40 bg-primary/5">
          <Button
            size="sm"
            variant="outline"
            onClick={onLoadPresets}
            className="w-full text-xs font-medium flex items-center justify-center gap-1.5 h-8 border-primary/30 text-primary hover:bg-primary/10"
          >
            <Sparkles className="size-3.5" /> Load All 14 Services
          </Button>
        </div>
      )}

      {/* Services List */}
      <InnerSidebarList>
        {filteredServices.length === 0 ? (
          <div className="p-3 text-center">
            <InnerSidebarEmpty
              message={
                searchQuery || selectedCategory !== "all"
                  ? "No matching services"
                  : "No services yet"
              }
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={onLoadPresets}
              className="mt-3 text-xs w-full"
            >
              <Sparkles className="size-3.5 mr-1.5" /> Load 14 Presets
            </Button>
          </div>
        ) : (
          filteredServices.map((c) => {
            const parsed = parseServiceConnector(c);
            const isSelected = c.id === activeId;
            const Icon = getServiceIcon(parsed.name, parsed.category);

            return (
              <InnerSidebarItem
                key={c.id}
                active={isSelected}
                onClick={() => onSelect(c.id)}
                onDelete={() => onDelete(c.id)}
              >
                <div className="flex items-center gap-2.5 w-full min-w-0">
                  <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <Icon className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs truncate">{parsed.name}</div>
                    <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                      {parsed.category}
                    </div>
                    <div className="text-[9px] text-muted-foreground/60 mt-0.5 font-mono flex items-center justify-between">
                      <span className="truncate">{parsed.budget}</span>
                      <span className="shrink-0">{parsed.whatICanDo.length} tasks</span>
                    </div>
                  </div>
                </div>
              </InnerSidebarItem>
            );
          })
        )}
      </InnerSidebarList>

      <InnerSidebarAddButton onClick={onNew} label="New Service" />
    </InnerSidebar>
  );
}
