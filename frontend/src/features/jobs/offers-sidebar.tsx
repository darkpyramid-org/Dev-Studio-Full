import { Handshake } from "lucide-react";
import { useMemo, useState } from "react";
import { usePagination } from "@/hooks/use-pagination";
import { ListPagination } from "@/components/ui/list-pagination";
import type { FreelanceOffer } from "@/types/jobs";
import { getStatusColor, OFFER_STATUS_LABELS } from "@/constants";
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
  offers: FreelanceOffer[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export function OffersSidebar({ offers, activeId, onSelect, onAdd }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Single-pass status count + memoized filter array
  const statusCounts = useMemo(
    () =>
      offers.reduce<Record<string, number>>((acc, o) => {
        acc[o.status] = (acc[o.status] ?? 0) + 1;
        return acc;
      }, {}),
    [offers],
  );

  const FILTERS = useMemo(
    () => [
      { label: "All", value: "all" },
      { label: "New", value: "new", count: statusCounts["new"] ?? 0 },
      { label: "In Review", value: "in_review", count: statusCounts["in_review"] ?? 0 },
      { label: "Accepted", value: "accepted", count: statusCounts["accepted"] ?? 0 },
      { label: "Done", value: "completed", count: statusCounts["completed"] ?? 0 },
      { label: "Rejected", value: "rejected", count: statusCounts["rejected"] ?? 0 },
    ],
    [statusCounts],
  );

  const filtered = offers.filter((o) => {
    const matchesSearch =
      (o.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.client ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.platform ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || o.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const { page, setPage, totalPages, paged, total, pageSize } = usePagination(filtered, 20);

  return (
    <InnerSidebar>
      <InnerSidebarHeader
        icon={<Handshake className="size-3.5" />}
        title="Offers"
        count={offers.length}
        onAdd={onAdd}
        addLabel="Add Offer"
      />
      <InnerSidebarSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search offers…"
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
              searchQuery || activeFilter !== "all" ? "No matching offers" : "No offers tracked yet."
            }
            subtitle={
              !searchQuery && activeFilter === "all"
                ? "Add offers from Mostaql, Upwork, Fiverr, etc."
                : undefined
            }
            icon={<Handshake className="size-4 text-muted-foreground/50" />}
          />
        )}
        <ul className="space-y-0.5">
          {paged.map((offer) => (
            <li key={offer.id}>
              <InnerSidebarItem active={activeId === offer.id} onClick={() => onSelect(offer.id)}>
                <p className="text-xs font-medium truncate leading-snug">{offer.title}</p>
                {offer.client && (
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {offer.client}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {offer.platform && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-lg font-medium ${getStatusColor(offer.platform, "platform") || "bg-muted text-muted-foreground"}`}
                    >
                      {offer.platform}
                    </span>
                  )}
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-lg border font-medium ${getStatusColor(offer.status, "offer")}`}
                  >
                    {OFFER_STATUS_LABELS[offer.status] ?? offer.status}
                  </span>
                  {offer.budget && (
                    <span className="text-[9px] text-green-400 font-medium">
                      {offer.budget} {offer.currency}
                    </span>
                  )}
                  {offer.category && (
                    <span className="text-[9px] text-muted-foreground/70 truncate">
                      {offer.category}
                    </span>
                  )}
                  {offer.deadline && (
                    <span className="text-[9px] text-muted-foreground/60">Due {offer.deadline}</span>
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
      <InnerSidebarAddButton onClick={onAdd} label="Add Offer" />
    </InnerSidebar>
  );
}
