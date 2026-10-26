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
  LayoutGrid,
  Table2,
  Star,
  Clock,
  Search,
  Eye,
  MoreHorizontal,
  ChevronRight,
  BarChart2,
  X,
  Link2,
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
import { cn } from "@/lib/utils";

interface PlatformsCatalogViewProps {
  connectors: Connector[];
  onUpsert: (connector: Connector) => void;
  onDelete: (id: string) => void;
}

/* ── Region icon helpers (Lucide-only, no emoji) ───────────── */
function RegionIcon({ regionCode, className }: { regionCode: string; className?: string }) {
  if (regionCode === "eg") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-sm bg-[#CE1126] text-white text-[9px] font-bold leading-none select-none shrink-0",
          className ?? "size-4",
        )}
        title="Egypt"
        aria-label="Egypt"
      >
        EG
      </span>
    );
  }
  if (regionCode === "sa") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-sm bg-[#006C35] text-white text-[9px] font-bold leading-none select-none shrink-0",
          className ?? "size-4",
        )}
        title="Saudi Arabia"
        aria-label="Saudi Arabia"
      >
        SA
      </span>
    );
  }
  return (
    <Globe
      className={cn("text-sky-500 shrink-0", className ?? "size-4")}
      aria-label="Global"
    />
  );
}

function regionLabel(regionCode: string) {
  if (regionCode === "eg") return "Egypt";
  if (regionCode === "sa") return "Saudi Arabia";
  return "Global";
}

/* ── Status badge ──────────────────────────────────────────── */
function StatusBadge({ status }: { status: ParsedPlatform["status"] }) {
  const map: Record<
    ParsedPlatform["status"],
    { label: string; icon: React.ReactNode; cls: string }
  > = {
    active: {
      label: "Active",
      icon: <CheckCircle2 className="size-3 shrink-0" />,
      cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    top_rated: {
      label: "Top Rated",
      icon: <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" />,
      cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    applied: {
      label: "Pending",
      icon: <Clock className="size-3 shrink-0" />,
      cls: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    exploring: {
      label: "Exploring",
      icon: <Search className="size-3 shrink-0" />,
      cls: "bg-muted text-muted-foreground border-border",
    },
  };
  const { label, icon, cls } = map[status] ?? map.exploring;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-semibold",
        cls,
      )}
    >
      {icon}
      {label}
    </span>
  );
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
  const [editingPlatform, setEditingPlatform] = useState<ParsedPlatform | null>(null);
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
      { label: "Global", value: "global", count: globalCount },
      { label: "Egypt", value: "eg", count: egCount },
      { label: "Saudi Arabia", value: "sa", count: saCount },
    ];
  }, [uniquePlatformConnectors]);

  // Load all 22 presets (deduplicated)
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
          region: "Global",
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
    setViewMode("detail");
    toast.success(`Created platform "${newPlatformData.name}"`);
  };

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

  const handleOpenDetail = (id: string) => {
    setActiveId(id);
    setViewMode("detail");
  };

  const handleBackToTable = () => {
    setViewMode("table");
  };

  // ── TABLE VIEW ──────────────────────────────────────────────
  const TableView = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Table header bar pinned to top */}
      <div className="px-5 py-3.5 sm:px-8 border-b border-border/60 bg-muted/20 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="size-4 text-primary" />
          <h2 className="text-base font-semibold">
            Platforms & Sites
          </h2>
          <span className="text-[11px] font-mono text-muted-foreground ml-1">
            ({filteredPlatforms.length})
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleLoadPresets}
            className="text-xs h-8 border-primary/30 text-primary hover:bg-primary/10"
          >
            <Sparkles className="size-3.5 mr-1" />
            Load Presets
          </Button>
          <Button
            size="sm"
            onClick={() => handleCreateNewPlatform()}
            className="text-xs h-8"
          >
            <Plus className="size-3.5 mr-1" />
            New Platform
          </Button>
        </div>
      </div>

      {/* Table scroll container - scrollbar right at main card edge */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur-xs">
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-[30px]">
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
          <tbody>
            {filteredPlatforms.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-muted-foreground text-sm">
                  <Globe className="size-8 mx-auto mb-3 opacity-20" />
                  <p>No platforms found</p>
                  {(searchQuery || selectedRegion !== "all") && (
                    <p className="text-xs mt-1 opacity-60">Try adjusting your filters</p>
                  )}
                </td>
              </tr>
            ) : (
              filteredPlatforms.map((c, idx) => {
                const parsed = parsePlatformConnector(c);
                const isActive = c.id === activeId;
                return (
                  <tr
                    key={c.id}
                    className={cn(
                      "border-b border-border/50 transition-colors group cursor-pointer",
                      isActive
                        ? "bg-primary/5"
                        : "hover:bg-muted/40",
                    )}
                    onClick={() => handleOpenDetail(c.id)}
                  >
                    {/* # */}
                    <td className="px-4 py-3 text-[11px] font-mono text-muted-foreground/50">
                      {idx + 1}
                    </td>

                    {/* Platform name + arabic name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Globe className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate max-w-[160px]">
                            {parsed.name}
                          </div>
                          {parsed.arabicName && (
                            <div className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                              {parsed.arabicName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Region */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <RegionIcon regionCode={parsed.regionCode} className="size-[14px]" />
                        <span className="text-xs text-muted-foreground">
                          {regionLabel(parsed.regionCode)}
                        </span>
                      </div>
                    </td>

                    {/* Website */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      {parsed.url && parsed.url !== "https://" ? (
                        <a
                          href={parsed.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono truncate max-w-[180px]"
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
                          className="size-7"
                          title="View details"
                          onClick={() => handleOpenDetail(c.id)}
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Delete"
                          onClick={() => setPendingDeleteId(c.id)}
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
      {filteredPlatforms.length > 0 && (
        <div className="px-5 py-2.5 sm:px-8 border-t border-border/60 bg-muted/20 shrink-0 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <span>
            {filteredPlatforms.filter((c) => parsePlatformConnector(c).status === "active").length} active
            &nbsp;·&nbsp;
            {filteredPlatforms.filter((c) => parsePlatformConnector(c).regionCode === "global").length} global
            &nbsp;·&nbsp;
            {filteredPlatforms.filter((c) => parsePlatformConnector(c).regionCode === "eg").length} eg
            &nbsp;·&nbsp;
            {filteredPlatforms.filter((c) => parsePlatformConnector(c).regionCode === "sa").length} sa
          </span>
          <span>{filteredPlatforms.length} total platforms</span>
        </div>
      )}
    </div>
  );

  // ── DETAIL VIEW ─────────────────────────────────────────────
  const DetailView = () => {
    if (!editingPlatform) {
      return (
        <div className="flex-1 flex items-center justify-center h-full text-muted-foreground">
          Select a platform or create a new one to start editing.
        </div>
      );
    }
    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Back + actions header pinned to top */}
        <div className="px-5 py-3.5 sm:px-8 border-b border-border/60 bg-muted/20 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleBackToTable}
              className="h-8 text-xs px-2 text-muted-foreground hover:text-foreground"
            >
              <Table2 className="size-3.5 mr-1" />
              All Platforms
            </Button>
            <ChevronRight className="size-3.5 text-muted-foreground/40" />
            <div className="flex items-center gap-2">
              <RegionIcon regionCode={editingPlatform.regionCode} className="size-5" />
              <span className="text-base font-semibold">{editingPlatform.name}</span>
              {editingPlatform.arabicName && (
                <span className="text-xs text-muted-foreground">
                  {editingPlatform.arabicName}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {editingPlatform.url && editingPlatform.url !== "https://" && (
              <Button variant="outline" size="sm" asChild className="text-xs h-8 gap-1.5">
                <a href={editingPlatform.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-3.5" />
                  Visit Platform
                </a>
              </Button>
            )}
            {editingPlatform.myProfileUrl && (
              <Button variant="secondary" size="sm" asChild className="text-xs h-8 gap-1.5">
                <a href={editingPlatform.myProfileUrl} target="_blank" rel="noreferrer">
                  <UserCheck className="size-3.5 text-emerald-500" />
                  My Profile
                </a>
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setPendingDeleteId(editingPlatform.id)}
              className="text-xs h-8 gap-1.5"
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
            <Button
              onClick={handleSavePlatform}
              disabled={isSaving}
              size="sm"
              className="text-xs h-8 gap-1.5"
            >
              <Save className="size-4" />
              {isSaving ? "Saving..." : "Save Platform"}
            </Button>
          </div>
        </div>

        {/* Form content - scrollbar sits on the right edge */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-8 flex flex-col gap-4">
            {/* Primary Info Card — table style */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/20">
              <Building className="size-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Platform Information &amp; Links
              </span>
            </div>

            <div className="divide-y divide-border/50">
              {/* Platform Name */}
              <div className="grid grid-cols-[180px_1fr] sm:grid-cols-[220px_1fr]">
                <div className="flex items-center gap-2 px-5 py-3 bg-muted/10 text-sm font-medium text-muted-foreground">
                  <Building className="size-3.5 shrink-0" />
                  Platform Name
                </div>
                <div className="px-4 py-2.5 flex items-center">
                  <Input
                    type="text"
                    value={editingPlatform.name}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, name: e.target.value })
                    }
                    className="font-medium border-transparent shadow-none focus-visible:ring-0 bg-transparent px-0 h-8"
                    placeholder="e.g. Upwork, Fiverr, منصة صبار"
                  />
                </div>
              </div>

              {/* Location / Region */}
              <div className="grid grid-cols-[180px_1fr] sm:grid-cols-[220px_1fr]">
                <div className="flex items-center gap-2 px-5 py-3 bg-muted/10 text-sm font-medium text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  Location / Region
                </div>
                <div className="px-4 py-2 flex items-center">
                  <Select
                    value={editingPlatform.region}
                    onValueChange={(val) => {
                      const region = val as ParsedPlatform["region"];
                      const regionCode = region.includes("Saudi")
                        ? "sa"
                        : region.includes("Egypt")
                        ? "eg"
                        : "global";
                      setEditingPlatform({ ...editingPlatform, region, regionCode });
                    }}
                  >
                    <SelectTrigger className="w-full max-w-[240px] h-8 text-sm border-transparent shadow-none bg-transparent focus:ring-0">
                      <div className="flex items-center gap-2">
                        <RegionIcon regionCode={editingPlatform.regionCode} className="size-[14px]" />
                        <SelectValue placeholder="Select region" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Global">
                        <div className="flex items-center gap-2">
                          <Globe className="size-3.5 text-sky-500" />
                          Global
                        </div>
                      </SelectItem>
                      <SelectItem value="Egypt">
                        <div className="flex items-center gap-2">
                          <RegionIcon regionCode="eg" className="size-[14px]" />
                          Egypt
                        </div>
                      </SelectItem>
                      <SelectItem value="Saudi Arabia">
                        <div className="flex items-center gap-2">
                          <RegionIcon regionCode="sa" className="size-[14px]" />
                          Saudi Arabia
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Official Website URL */}
              <div className="grid grid-cols-[180px_1fr] sm:grid-cols-[220px_1fr]">
                <div className="flex items-center gap-2 px-5 py-3 bg-muted/10 text-sm font-medium text-muted-foreground">
                  <ExternalLink className="size-3.5 shrink-0" />
                  Official Website URL
                </div>
                <div className="px-4 py-2.5 flex items-center gap-2">
                  <Input
                    type="url"
                    value={editingPlatform.url}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, url: e.target.value })
                    }
                    className="flex-1 font-mono text-xs border-transparent shadow-none focus-visible:ring-0 bg-transparent px-0 h-8"
                    placeholder="https://www.upwork.com"
                  />
                  {editingPlatform.url && editingPlatform.url !== "https://" && (
                    <a
                      href={editingPlatform.url}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* My Profile / Store URL */}
              <div className="grid grid-cols-[180px_1fr] sm:grid-cols-[220px_1fr]">
                <div className="flex items-center gap-2 px-5 py-3 bg-muted/10 text-sm font-medium text-muted-foreground">
                  <UserCheck className="size-3.5 shrink-0" />
                  My Profile / Store URL
                </div>
                <div className="px-4 py-2.5 flex items-center gap-2">
                  <Input
                    type="url"
                    value={editingPlatform.myProfileUrl || ""}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, myProfileUrl: e.target.value })
                    }
                    className="flex-1 font-mono text-xs border-transparent shadow-none focus-visible:ring-0 bg-transparent px-0 h-8"
                    placeholder="e.g. https://www.upwork.com/freelancers/~0123abc"
                  />
                  {editingPlatform.myProfileUrl && (
                    <a
                      href={editingPlatform.myProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-emerald-500 hover:text-emerald-600"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Commission & Fees */}
              <div className="grid grid-cols-[180px_1fr] sm:grid-cols-[220px_1fr]">
                <div className="flex items-center gap-2 px-5 py-3 bg-muted/10 text-sm font-medium text-muted-foreground">
                  <Percent className="size-3.5 shrink-0" />
                  Commission &amp; Fees
                </div>
                <div className="px-4 py-2.5 flex items-center">
                  <Input
                    type="text"
                    value={editingPlatform.commission}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, commission: e.target.value })
                    }
                    className="font-mono text-xs border-transparent shadow-none focus-visible:ring-0 bg-transparent px-0 h-8"
                    placeholder="10% Flat Fee, 0% Commission..."
                  />
                </div>
              </div>

              {/* Account Status */}
              <div className="grid grid-cols-[180px_1fr] sm:grid-cols-[220px_1fr]">
                <div className="flex items-center gap-2 px-5 py-3 bg-muted/10 text-sm font-medium text-muted-foreground">
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  Account Status
                </div>
                <div className="px-4 py-2 flex items-center">
                  <Select
                    value={editingPlatform.status}
                    onValueChange={(val: any) =>
                      setEditingPlatform({ ...editingPlatform, status: val })
                    }
                  >
                    <SelectTrigger className="w-full max-w-[240px] h-8 text-sm border-transparent shadow-none bg-transparent focus:ring-0">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                          Active Account
                        </div>
                      </SelectItem>
                      <SelectItem value="top_rated">
                        <div className="flex items-center gap-2">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          Top Rated / Pro
                        </div>
                      </SelectItem>
                      <SelectItem value="applied">
                        <div className="flex items-center gap-2">
                          <Clock className="size-3.5 text-blue-500" />
                          Application Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="exploring">
                        <div className="flex items-center gap-2">
                          <Search className="size-3.5 text-muted-foreground" />
                          Exploring
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* What this platform is best for */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/20">
              <BarChart2 className="size-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                What This Platform Is Best For
              </span>
            </div>

            <div className="divide-y divide-border/50">
              {/* Best For */}
              <div className="grid grid-cols-[180px_1fr] sm:grid-cols-[220px_1fr]">
                <div className="flex items-center gap-2 px-5 py-3 bg-muted/10 text-sm font-medium text-muted-foreground">
                  <Star className="size-3.5 shrink-0" />
                  Key Value Proposition
                </div>
                <div className="px-4 py-2.5">
                  <Input
                    value={editingPlatform.bestFor}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, bestFor: e.target.value })
                    }
                    className="text-sm font-medium border-transparent shadow-none focus-visible:ring-0 bg-transparent px-0 h-8"
                    placeholder="e.g. Enterprise contracts, fast hourly shifts, packaged landing pages"
                  />
                </div>
              </div>

              {/* Platform Overview */}
              <div className="grid grid-cols-[180px_1fr] sm:grid-cols-[220px_1fr]">
                <div className="flex items-center gap-2 px-5 py-3 bg-muted/10 text-sm font-medium text-muted-foreground align-top">
                  <MoreHorizontal className="size-3.5 shrink-0 mt-0.5" />
                  Platform Overview &amp; Operating Notes
                </div>
                <div className="px-4 py-3">
                  <TextArea
                    value={editingPlatform.description}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, description: e.target.value })
                    }
                    rows={4}
                    className="w-full resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 shadow-none text-sm leading-relaxed bg-transparent"
                    placeholder="Add notes about payment escrow, client expectations, proposal tips, or account requirements..."
                  />
                </div>
              </div>
            </div>
          </div>

            {/* Footer */}
            <div className="text-[11px] text-muted-foreground font-mono pb-2">
              Last updated: {new Date(editingPlatform.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
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

            {/* View mode switcher */}
            <div className="px-2 py-1.5 flex items-center gap-1.5 border-b border-border/40">
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 h-7 rounded-lg text-xs transition-colors",
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/60"
                )}
              >
                <Table2 className="size-3.5" />
                Table
              </button>
              <button
                onClick={() => activeId && setViewMode("detail")}
                disabled={!activeId}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 h-7 rounded-lg text-xs transition-colors",
                  viewMode === "detail"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/60",
                  !activeId && "opacity-40 cursor-not-allowed"
                )}
              >
                <LayoutGrid className="size-3.5" />
                Detail
              </button>
            </div>

            {/* Presets loader pill */}
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
                  return (
                    <InnerSidebarItem
                      key={c.id}
                      active={isSelected}
                      onClick={() => {
                        setActiveId(c.id);
                        if (viewMode === "detail") setViewMode("detail");
                      }}
                      onDelete={() => setPendingDeleteId(c.id)}
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

            <InnerSidebarAddButton
              onClick={() => handleCreateNewPlatform()}
              label="New Platform"
            />
          </InnerSidebar>
        }
      >
        {/* Main Content Area — Table or Detail */}
        {viewMode === "table" ? <TableView /> : <DetailView />}
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
