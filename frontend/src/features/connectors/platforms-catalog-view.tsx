import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  Globe,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  Sparkles,
  MapPin,
  Percent,
  CheckCircle2,
  UserCheck,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, TextArea } from "@/features/tools/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Connector } from "@/types/tools";
import { newId } from "@/lib/store";
import {
  PRESET_PLATFORMS,
  type PlatformPreset,
} from "@/constants/platforms-presets";
import {
  parsePlatformConnector,
  serializePlatformConnector,
  getPlatformFlag,
  type ParsedPlatform,
} from "./platform-helpers";
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
  SplitLayout,
} from "@/components/layout";

interface PlatformsCatalogViewProps {
  connectors: Connector[];
  onUpsert: (connector: Connector) => void;
  onDelete: (id: string) => void;
}

export function PlatformsCatalogView({
  connectors,
  onUpsert,
  onDelete,
}: PlatformsCatalogViewProps) {
  const platformConnectors = useMemo(
    () => connectors.filter((c) => c.type === "platforms"),
    [connectors]
  );

  // Deduplicate platform connectors by normalized name so no duplicates appear
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

  // Editable platform state
  const [editingPlatform, setEditingPlatform] = useState<ParsedPlatform | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-select first platform when list loads or changes
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

  // Filtered platforms
  const filteredPlatforms = useMemo(() => {
    return uniquePlatformConnectors.filter((c) => {
      const parsed = parsePlatformConnector(c);
      const matchesSearch =
        parsed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (parsed.arabicName && parsed.arabicName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        parsed.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parsed.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRegion =
        selectedRegion === "all" ||
        (selectedRegion === "global" && parsed.regionCode === "global") ||
        (selectedRegion === "eg" && parsed.regionCode === "eg") ||
        (selectedRegion === "sa" && parsed.regionCode === "sa");

      return matchesSearch && matchesRegion;
    });
  }, [uniquePlatformConnectors, searchQuery, selectedRegion]);

  // Counts for region filter tabs
  const regionFilters = useMemo(() => {
    const globalCount = uniquePlatformConnectors.filter(
      (c) => parsePlatformConnector(c).regionCode === "global"
    ).length;
    const egCount = uniquePlatformConnectors.filter(
      (c) => parsePlatformConnector(c).regionCode === "eg"
    ).length;
    const saCount = uniquePlatformConnectors.filter(
      (c) => parsePlatformConnector(c).regionCode === "sa"
    ).length;

    return [
      { label: "All", value: "all", count: uniquePlatformConnectors.length },
      { label: "Global 🌐", value: "global", count: globalCount },
      { label: "Egypt 🇪🇬", value: "eg", count: egCount },
      { label: "Saudi Arabia 🇸🇦", value: "sa", count: saCount },
    ];
  }, [uniquePlatformConnectors]);

  // 1-Click Load All 22 Presets (deduplicated)
  const handleLoadPresets = () => {
    const existingNames = new Set(
      uniquePlatformConnectors.map((s) => s.name.trim().toLowerCase())
    );

    let addedCount = 0;
    for (const preset of PRESET_PLATFORMS) {
      if (!existingNames.has(preset.name.trim().toLowerCase())) {
        const id = newId("plt");
        const connector = serializePlatformConnector({
          id,
          name: preset.name,
          arabicName: preset.arabicName,
          region: preset.region,
          regionCode: preset.regionCode,
          url: preset.url,
          myProfileUrl: "",
          commission: preset.commission,
          description: preset.description,
          bestFor: preset.bestFor,
          specialties: preset.specialties,
          tags: preset.tags,
          status: "active",
          updatedAt: Date.now(),
        });
        onUpsert(connector);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      toast.success(`Loaded ${addedCount} platforms into your list!`);
    } else {
      toast.info("All 22 preset platforms are already loaded.");
    }
  };

  // Create new platform
  const handleCreateNewPlatform = (preset?: PlatformPreset) => {
    const id = newId("plt");
    const newPlatformData: ParsedPlatform = preset
      ? {
          id,
          name: preset.name,
          arabicName: preset.arabicName,
          region: preset.region,
          regionCode: preset.regionCode,
          url: preset.url,
          myProfileUrl: "",
          commission: preset.commission,
          description: preset.description,
          bestFor: preset.bestFor,
          specialties: [...preset.specialties],
          tags: [...preset.tags],
          status: "active",
          updatedAt: Date.now(),
        }
      : {
          id,
          name: "New Freelance Platform",
          region: "Global 🌐",
          regionCode: "global",
          url: "https://",
          commission: "Standard Commission",
          description: "Freelance marketplace and contracting hub for digital work.",
          bestFor: "Client projects and freelance inquiries",
          specialties: ["Web Development", "UI/UX Design"],
          tags: ["Freelance", "Marketplace"],
          status: "exploring",
          updatedAt: Date.now(),
        };

    const connector = serializePlatformConnector(newPlatformData);
    onUpsert(connector);
    setActiveId(id);
    setEditingPlatform(newPlatformData);
    toast.success(`Created platform "${newPlatformData.name}"`);
  };

  // Save changes
  const handleSavePlatform = () => {
    if (!editingPlatform) return;
    setIsSaving(true);
    try {
      const connector = serializePlatformConnector(editingPlatform);
      onUpsert(connector);
      toast.success(`Saved "${editingPlatform.name}"`);
    } catch {
      toast.error("Failed to save platform");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 h-full overflow-hidden">
      <SplitLayout
        sidebarWidth="lg:w-[260px]"
        sidebar={
          <InnerSidebar>
            <InnerSidebarHeader
              icon={<Globe className="size-3.5" />}
              title="Platforms"
              count={uniquePlatformConnectors.length}
              onAdd={() => handleCreateNewPlatform()}
              addLabel="New Platform"
            />

            <InnerSidebarSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search platforms..."
            />

            <div className="pt-1.5 pb-1">
              <InnerSidebarFilters
                wrap={true}
                filters={regionFilters}
                active={selectedRegion}
                onChange={setSelectedRegion}
              />
            </div>

            <InnerSidebarDivider />

            {/* Presets loader pill if missing */}
            {uniquePlatformConnectors.length < 22 && (
              <div className="p-2 border-b border-border/40 bg-primary/5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLoadPresets}
                  className="w-full text-xs font-medium flex items-center justify-center gap-1.5 h-8 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Sparkles className="size-3.5" /> Load All 22 Platforms
                </Button>
              </div>
            )}

            {/* Platforms List */}
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
                    onClick={handleLoadPresets}
                    className="mt-3 text-xs w-full"
                  >
                    <Sparkles className="size-3.5 mr-1.5" /> Load 22 Presets
                  </Button>
                </div>
              ) : (
                filteredPlatforms.map((c) => {
                  const parsed = parsePlatformConnector(c);
                  const isSelected = c.id === activeId;
                  const flag = getPlatformFlag(parsed.regionCode);

                  return (
                    <InnerSidebarItem
                      key={c.id}
                      active={isSelected}
                      onClick={() => setActiveId(c.id)}
                      onDelete={() => setPendingDeleteId(c.id)}
                    >
                      <div className="flex items-center gap-2.5 w-full min-w-0">
                        <span className="text-sm shrink-0">{flag}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs truncate">
                            {parsed.name}
                          </div>
                          <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                            {parsed.arabicName || parsed.region}
                          </div>
                          <div className="text-[9px] text-muted-foreground/60 mt-0.5 font-mono">
                            {parsed.commission}
                          </div>
                        </div>
                      </div>
                    </InnerSidebarItem>
                  );
                })
              )}
            </InnerSidebarList>

            <InnerSidebarAddButton
              onClick={() => handleCreateNewPlatform()}
              label="New Platform"
            />
          </InnerSidebar>
        }
      >
        {/* Main Content Area */}
        {editingPlatform ? (
          <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-10 h-full flex flex-col overflow-hidden">
            {/* Top Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getPlatformFlag(editingPlatform.regionCode)}</span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold capitalize">
                    {editingPlatform.name} Details
                  </h2>
                  {editingPlatform.arabicName && (
                    <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                      {editingPlatform.arabicName}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                {editingPlatform.url && editingPlatform.url !== "https://" && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex items-center gap-1.5 text-xs h-9"
                  >
                    <a
                      href={editingPlatform.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="size-3.5" /> Visit Platform ↗
                    </a>
                  </Button>
                )}

                {editingPlatform.myProfileUrl && (
                  <Button
                    variant="secondary"
                    size="sm"
                    asChild
                    className="flex items-center gap-1.5 text-xs h-9"
                  >
                    <a
                      href={editingPlatform.myProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <UserCheck className="size-3.5 text-emerald-500" /> My Profile ↗
                    </a>
                  </Button>
                )}

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setPendingDeleteId(editingPlatform.id)}
                  className="flex items-center gap-1.5 text-xs h-9"
                >
                  <Trash2 className="size-3.5" /> Delete
                </Button>

                <Button
                  onClick={handleSavePlatform}
                  disabled={isSaving}
                  className="flex items-center gap-2 text-xs h-9"
                >
                  <Save className="size-4" /> {isSaving ? "Saving..." : "Save Details"}
                </Button>
              </div>
            </div>

            {/* Form & Notes Content */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-thin">
              {/* Form Card */}
              <div className="bg-card border border-border rounded-lg p-4 sm:p-6 flex flex-col gap-4">
                {/* Platform Name */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm font-medium text-muted-foreground sm:w-36 shrink-0 flex items-center gap-2">
                    <Building className="size-4" /> Platform Name:
                  </span>
                  <Input
                    type="text"
                    value={editingPlatform.name}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, name: e.target.value })
                    }
                    className="flex-1 font-medium"
                    placeholder="e.g. Upwork, Fiverr, منصة صبار"
                  />
                </div>

                {/* Location / Region (Reusable Select) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm font-medium text-muted-foreground sm:w-36 shrink-0 flex items-center gap-2">
                    <MapPin className="size-4" /> Location / Region:
                  </span>
                  <div className="flex-1">
                    <Select
                      value={editingPlatform.region}
                      onValueChange={(val) => {
                        const region = val as any;
                        const regionCode = region.includes("Saudi")
                          ? "sa"
                          : region.includes("Egypt")
                          ? "eg"
                          : "global";
                        setEditingPlatform({ ...editingPlatform, region, regionCode });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Global 🌐">Global 🌐</SelectItem>
                        <SelectItem value="Egypt 🇪🇬">Egypt 🇪🇬</SelectItem>
                        <SelectItem value="Saudi Arabia 🇸🇦">Saudi Arabia 🇸🇦</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Website URL */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm font-medium text-muted-foreground sm:w-36 shrink-0 flex items-center gap-2">
                    <ExternalLink className="size-4" /> Website URL:
                  </span>
                  <Input
                    type="url"
                    value={editingPlatform.url}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, url: e.target.value })
                    }
                    className="flex-1 font-mono text-xs"
                    placeholder="https://www.upwork.com"
                  />
                </div>

                {/* My Profile Link */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm font-medium text-muted-foreground sm:w-36 shrink-0 flex items-center gap-2">
                    <UserCheck className="size-4" /> My Profile Link:
                  </span>
                  <Input
                    type="url"
                    value={editingPlatform.myProfileUrl || ""}
                    onChange={(e) =>
                      setEditingPlatform({
                        ...editingPlatform,
                        myProfileUrl: e.target.value,
                      })
                    }
                    className="flex-1 font-mono text-xs"
                    placeholder="https://www.upwork.com/freelancers/~0123"
                  />
                </div>

                {/* Commission & Fees */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm font-medium text-muted-foreground sm:w-36 shrink-0 flex items-center gap-2">
                    <Percent className="size-4" /> Commission & Fees:
                  </span>
                  <Input
                    type="text"
                    value={editingPlatform.commission}
                    onChange={(e) =>
                      setEditingPlatform({
                        ...editingPlatform,
                        commission: e.target.value,
                      })
                    }
                    className="flex-1"
                    placeholder="10% Flat Fee, 0% Commission..."
                  />
                </div>

                {/* Account Status (Reusable Select) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm font-medium text-muted-foreground sm:w-36 shrink-0 flex items-center gap-2">
                    <CheckCircle2 className="size-4" /> Account Status:
                  </span>
                  <div className="flex-1">
                    <Select
                      value={editingPlatform.status}
                      onValueChange={(val: any) =>
                        setEditingPlatform({ ...editingPlatform, status: val })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active Account ✅</SelectItem>
                        <SelectItem value="top_rated">Top Rated / Pro ⭐</SelectItem>
                        <SelectItem value="applied">Application Pending ⏳</SelectItem>
                        <SelectItem value="exploring">Exploring 🔍</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Notes & Details Card */}
              <div className="flex-1 bg-card border border-border rounded-lg p-6 flex flex-col gap-4 min-h-[220px]">
                <div>
                  <span className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Best For & Key Value:
                  </span>
                  <Input
                    value={editingPlatform.bestFor}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, bestFor: e.target.value })
                    }
                    className="text-sm font-medium"
                    placeholder="e.g. Enterprise contracts, fast hourly shifts, packaged landing pages"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground mb-2 block">
                    Notes & Details:
                  </span>
                  <TextArea
                    value={editingPlatform.description}
                    onChange={(e) =>
                      setEditingPlatform({
                        ...editingPlatform,
                        description: e.target.value,
                      })
                    }
                    className="w-full flex-1 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 shadow-none text-sm leading-relaxed bg-transparent min-h-[100px]"
                    placeholder="Add notes about payment escrow, client expectations, proposal tips, or account requirements..."
                  />
                </div>

                <div className="pt-4 border-t border-border flex justify-between items-center text-[11px] text-muted-foreground font-mono">
                  <span>Last updated: {new Date(editingPlatform.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
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
