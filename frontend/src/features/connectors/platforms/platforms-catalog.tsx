import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { SplitLayout } from "@/components/layout";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Connector } from "@/types/tools";
import type { Platform } from "@/types/platforms";
import { newId } from "@/lib/store";
import { PRESET_PLATFORMS } from "@/constants/platforms-presets";
import { parsePlatformConnector, serializePlatformConnector } from "../platform-helpers";
import { PlatformSidebar } from "./platform-sidebar";
import { PlatformTableView } from "./platform-table-view";
import { PlatformDetailView } from "./platform-detail-view";

export interface PlatformsCatalogProps {
  connectors: Connector[];
  onUpsert: (connector: Connector) => void;
  onDelete: (id: string) => void;
}

export function PlatformsCatalog({
  connectors,
  onUpsert,
  onDelete,
}: PlatformsCatalogProps) {
  const platformConnectors = useMemo(
    () => connectors.filter((c) => c.type === "platforms"),
    [connectors]
  );

  // Deduplicate by normalized name
  const uniquePlatformConnectors = useMemo(() => {
    const seen = new Set<string>();
    const list: Connector[] = [];
    for (const c of platformConnectors) {
      const key = (c.name || "").trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(c);
      }
    }
    return list;
  }, [platformConnectors]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "detail">("table");

  // Editable platform state
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-select first platform when list loads
  useEffect(() => {
    if (uniquePlatformConnectors.length > 0) {
      if (!activeId || !uniquePlatformConnectors.some((c) => c.id === activeId)) {
        setActiveId(uniquePlatformConnectors[0].id);
      }
    } else {
      setActiveId(null);
      setEditingPlatform(null);
    }
  }, [uniquePlatformConnectors, activeId]);

  // When activeId changes, parse connector into editable state
  useEffect(() => {
    if (!activeId) {
      setEditingPlatform(null);
      return;
    }
    const current = uniquePlatformConnectors.find((c) => c.id === activeId);
    if (current) {
      setEditingPlatform(parsePlatformConnector(current));
    }
  }, [activeId, uniquePlatformConnectors]);

  // Parse each connector exactly once per render cycle — this memoized array
  // is the single source for filtering, region counts and the detail view.
  const parsedPlatforms = useMemo(
    () => uniquePlatformConnectors.map(parsePlatformConnector),
    [uniquePlatformConnectors],
  );

  const filteredPlatforms = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return parsedPlatforms.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        (p.arabicName && p.arabicName.toLowerCase().includes(q)) ||
        p.bestFor.toLowerCase().includes(q) ||
        p.specialties.some((s) => s.toLowerCase().includes(q));

      const matchesRegion = selectedRegion === "all" || p.regionCode === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [parsedPlatforms, searchQuery, selectedRegion]);

  // Counts for region filter tabs — single pass over the parsed list
  const regionFilters = useMemo(() => {
    const counts = parsedPlatforms.reduce(
      (acc, p) => {
        acc[p.regionCode]++;
        return acc;
      },
      { global: 0, eg: 0, sa: 0 } as Record<Platform["regionCode"], number>,
    );

    return [
      { label: "All", value: "all", count: parsedPlatforms.length },
      { label: "Global", value: "global", count: counts.global },
      { label: "Egypt", value: "eg", count: counts.eg },
      { label: "Saudi Arabia", value: "sa", count: counts.sa },
    ];
  }, [parsedPlatforms]);

  const handleCreateNewPlatform = () => {
    const defaultRegion =
      selectedRegion === "eg"
        ? { code: "eg" as const, name: "Egypt" as const }
        : selectedRegion === "sa"
        ? { code: "sa" as const, name: "Saudi Arabia" as const }
        : { code: "global" as const, name: "Global" as const };

    const newPlatform: Platform = {
      id: newId("conn"),
      name: "New Platform",
      arabicName: "",
      region: defaultRegion.name,
      regionCode: defaultRegion.code,
      url: "https://",
      myProfileUrl: "",
      commission: "10-20%",
      description: "Freelance marketplace and talent contracting hub.",
      bestFor: "Connecting with clients",
      specialties: ["General Freelance"],
      tags: ["Freelance", "Marketplace"],
      status: "active",
      rating: 4.5,
      updatedAt: Date.now(),
    };

    const connector = serializePlatformConnector(newPlatform);
    onUpsert(connector);
    setActiveId(newPlatform.id);
    setEditingPlatform(newPlatform);
    setViewMode("detail");
    toast.success("New platform created");
  };

  const handleLoadPresets = () => {
    let addedCount = 0;
    for (const preset of PRESET_PLATFORMS) {
      const exists = uniquePlatformConnectors.some(
        (c) =>
          c.name.trim().toLowerCase() === preset.name.trim().toLowerCase() ||
          c.id === `preset-${preset.id}`
      );
      if (!exists) {
        const platform: Platform = {
          id: `preset-${preset.id}`,
          name: preset.name,
          arabicName: preset.arabicName || "",
          region: preset.region,
          regionCode: preset.regionCode,
          url: preset.url,
          myProfileUrl: "",
          commission: preset.commission,
          description: preset.description,
          bestFor: preset.bestFor,
          specialties: preset.specialties,
          tags: ["Freelance", "Marketplace"],
          status: "active",
          rating: 4.5,
          updatedAt: Date.now(),
        };
        const connector = serializePlatformConnector(platform);
        onUpsert(connector);
        addedCount++;
      }
    }
    if (addedCount > 0) {
      toast.success(`Loaded ${addedCount} platform preset${addedCount > 1 ? "s" : ""}`);
    } else {
      toast.info("All presets are already loaded in your catalog");
    }
  };

  const handleSavePlatform = () => {
    if (!editingPlatform) return;
    setIsSaving(true);
    try {
      const existing = uniquePlatformConnectors.find((c) => c.id === editingPlatform.id);
      const connector = serializePlatformConnector(editingPlatform, existing?.createdAt);
      onUpsert(connector);
      toast.success(`${editingPlatform.name} saved successfully`);
    } catch {
      toast.error("Failed to save platform");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDetail = (id: string) => {
    setActiveId(id);
    setViewMode("detail");
  };

  const handleBackToTable = () => {
    setViewMode("table");
  };

  return (
    <div className="flex-1 min-h-0 h-full overflow-hidden">
      <SplitLayout
        sidebarWidth="lg:w-[260px]"
        sidebar={
          <PlatformSidebar
            totalCount={uniquePlatformConnectors.length}
            filteredPlatforms={filteredPlatforms}
            activeId={activeId}
            onSelect={(id) => {
              setActiveId(id);
              if (viewMode === "detail") setViewMode("detail");
            }}
            onDelete={(id) => setPendingDeleteId(id)}
            onNew={handleCreateNewPlatform}
            onLoadPresets={handleLoadPresets}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            regionFilters={regionFilters}
          />
        }
      >
        {/* Main Content Area — Table or Detail */}
        {viewMode === "table" ? (
          <PlatformTableView
            platforms={filteredPlatforms}
            totalCount={uniquePlatformConnectors.length}
            onSelectPlatform={handleOpenDetail}
            onDeletePlatform={(id) => setPendingDeleteId(id)}
            onNewPlatform={handleCreateNewPlatform}
            onLoadPresets={handleLoadPresets}
            searchQuery={searchQuery}
            selectedRegion={selectedRegion}
          />
        ) : editingPlatform ? (
          <PlatformDetailView
            platform={editingPlatform}
            onChange={setEditingPlatform}
            onSave={handleSavePlatform}
            onDelete={(id) => setPendingDeleteId(id)}
            onBack={handleBackToTable}
            isSaving={isSaving}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center h-full text-muted-foreground">
            Select a platform or create a new one to start editing.
          </div>
        )}
      </SplitLayout>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        title="Delete Platform"
        description="Are you sure you want to remove this platform from your catalog? This action cannot be undone."
        onConfirm={() => {
          if (pendingDeleteId) {
            onDelete(pendingDeleteId);
            setPendingDeleteId(null);
            toast.success("Platform removed");
          }
        }}
      />
    </div>
  );
}
