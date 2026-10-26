import { Star } from "lucide-react";
import { useMemo, useState } from "react";
import { usePagination } from "@/hooks/use-pagination";
import { ListPagination } from "@/components/ui/list-pagination";
import type { MyService } from "@/types/jobs";
import { getStatusColor, SERVICE_STATUS_LABELS } from "@/constants";
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

interface Props {
  services: MyService[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export function ServicesSidebar({ services, activeId, onSelect, onAdd }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Single-pass status count + memoized filter array
  const statusCounts = useMemo(
    () =>
      services.reduce<Record<string, number>>((acc, s) => {
        acc[s.status] = (acc[s.status] ?? 0) + 1;
        return acc;
      }, {}),
    [services],
  );

  const FILTERS = useMemo(
    () => [
      { label: "All", value: "all" },
      { label: "Active", value: "active", count: statusCounts["active"] ?? 0 },
      { label: "Paused", value: "paused", count: statusCounts["paused"] ?? 0 },
      { label: "Draft", value: "draft", count: statusCounts["draft"] ?? 0 },
    ],
    [statusCounts],
  );

  const filtered = services.filter((s) => {
    const matchesSearch =
      (s.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.platform ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || s.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const { page, setPage, totalPages, paged, total, pageSize } = usePagination(filtered, 20);

  return (
    <InnerSidebar>
      <InnerSidebarHeader
        icon={<Star className="size-3.5" />}
        title="Services"
        count={services.length}
        onAdd={onAdd}
        addLabel="Add Service"
      />
      <InnerSidebarSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search services…"
      />
      <InnerSidebarFilters
        filters={FILTERS}
        active={activeFilter}
        onChange={setActiveFilter}
        wrap
      />
      <InnerSidebarDivider />
      <InnerSidebarList>
        {filtered.length === 0 && (
          <InnerSidebarEmpty
            message={
              searchQuery || activeFilter !== "all"
                ? "No matching services"
                : "No services listed yet."
            }
            subtitle={
              !searchQuery && activeFilter === "all"
                ? "Add your Fiverr, Mostaql, or Khamsat gigs."
                : undefined
            }
            icon={<Star className="size-4 text-muted-foreground/50" />}
          />
        )}
        <ul className="space-y-0.5">
          {paged.map((svc) => (
            <li key={svc.id}>
              <InnerSidebarItem active={activeId === svc.id} onClick={() => onSelect(svc.id)}>
                <p className="text-xs font-medium truncate leading-snug">{svc.title}</p>
                {svc.category && (
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {svc.category}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {svc.platform && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-lg font-medium ${getStatusColor(svc.platform, "platform") || "bg-muted text-muted-foreground"}`}
                    >
                      {svc.platform}
                    </span>
                  )}
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-lg border font-medium ${getStatusColor(svc.status, "service")}`}
                  >
                    {SERVICE_STATUS_LABELS[svc.status] ?? svc.status}
                  </span>
                  {svc.price && (
                    <span className="text-[9px] text-green-400 font-medium">
                      {svc.price} {svc.currency}
                    </span>
                  )}
                  {svc.deliveryDays && (
                    <span className="text-[9px] text-muted-foreground/60">
                      {svc.deliveryDays}d delivery
                    </span>
                  )}
                </div>
              </InnerSidebarItem>
            </li>
          ))}
        </ul>
      </InnerSidebarList>
      <ListPagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={setPage}
      />
      <InnerSidebarAddButton onClick={onAdd} label="Add Service" />
    </InnerSidebar>
  );
}
