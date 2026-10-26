import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  Globe,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  Sparkles,
  Link as LinkIcon,
  Search,
  Check,
  Tag,
  Layers,
  MapPin,
  Percent,
  CheckCircle2,
  Star,
  UserCheck,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, TextArea } from "@/features/tools/shared";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Connector } from "@/types/tools";
import { newId } from "@/lib/store";
import {
  PRESET_PLATFORMS,
  PLATFORM_REGIONS,
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
  InnerSidebarList,
  InnerSidebarItem,
  InnerSidebarEmpty,
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

  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Editable platform state
  const [editingPlatform, setEditingPlatform] = useState<ParsedPlatform | null>(null);
  const [newSpecialtyInput, setNewSpecialtyInput] = useState("");
  const [newTagInput, setNewTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Auto-select first platform
  useEffect(() => {
    if (platformConnectors.length > 0) {
      if (!activeId || !platformConnectors.some((c) => c.id === activeId)) {
        setActiveId(platformConnectors[0].id);
      }
    } else {
      setActiveId(null);
      setEditingPlatform(null);
    }
  }, [platformConnectors, activeId]);

  // When activeId changes, parse connector into editable state
  useEffect(() => {
    if (!activeId) {
      setEditingPlatform(null);
      return;
    }
    const current = platformConnectors.find((c) => c.id === activeId);
    if (current) {
      setEditingPlatform(parsePlatformConnector(current));
    }
  }, [activeId, platformConnectors]);

  // Filtered platforms
  const filteredPlatforms = useMemo(() => {
    return platformConnectors.filter((c) => {
      const parsed = parsePlatformConnector(c);
      const matchesSearch =
        parsed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (parsed.arabicName && parsed.arabicName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        parsed.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parsed.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        parsed.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRegion =
        selectedRegion === "All" || parsed.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [platformConnectors, searchQuery, selectedRegion]);

  // 1-Click Load All 22 Presets
  const handleLoadPresets = () => {
    const existingNames = new Set(
      platformConnectors.map((s) => s.name.trim().toLowerCase())
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

  // Add / Remove Specialty
  const handleAddSpecialty = () => {
    if (!newSpecialtyInput.trim() || !editingPlatform) return;
    setEditingPlatform({
      ...editingPlatform,
      specialties: [...editingPlatform.specialties, newSpecialtyInput.trim()],
    });
    setNewSpecialtyInput("");
  };

  const handleRemoveSpecialty = (index: number) => {
    if (!editingPlatform) return;
    const next = [...editingPlatform.specialties];
    next.splice(index, 1);
    setEditingPlatform({ ...editingPlatform, specialties: next });
  };

  // Add / Remove Tag
  const handleAddTag = () => {
    if (!newTagInput.trim() || !editingPlatform) return;
    const tag = newTagInput.trim();
    if (!editingPlatform.tags.includes(tag)) {
      setEditingPlatform({
        ...editingPlatform,
        tags: [...editingPlatform.tags, tag],
      });
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingPlatform) return;
    setEditingPlatform({
      ...editingPlatform,
      tags: editingPlatform.tags.filter((t) => t !== tagToRemove),
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "top_rated":
        return {
          label: "Top Rated ⭐",
          className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        };
      case "active":
        return {
          label: "Active Account ✅",
          className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
      case "applied":
        return {
          label: "Application Pending ⏳",
          className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        };
      default:
        return {
          label: "Exploring 🔍",
          className: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  return (
    <div className="flex-1 min-h-0 h-full overflow-hidden">
      <SplitLayout
        sidebarWidth="lg:w-[320px]"
        sidebar={
          <InnerSidebar>
            <InnerSidebarHeader
              icon={<Globe className="size-4 text-primary" />}
              title="Sites & Platforms"
              count={platformConnectors.length}
              onAdd={() => handleCreateNewPlatform()}
              addLabel="New Site"
            />

            <InnerSidebarSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, region or skill..."
            />

            {/* Region Filter Tabs */}
            <div className="px-2 pb-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 border-b border-border/50">
              {PLATFORM_REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                    selectedRegion === region
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* 1-Click Load 22 Presets Action Bar */}
            {platformConnectors.length < 22 && (
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
                      searchQuery || selectedRegion !== "All"
                        ? "No matching platforms found"
                        : "No platforms added yet"
                    }
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleLoadPresets}
                    className="mt-3 text-xs w-full"
                  >
                    <Sparkles className="size-3.5 mr-1.5" /> Load 22 Platforms
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
                        <div
                          className={`size-7 rounded-md flex items-center justify-center text-sm shrink-0 ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground group-hover:bg-muted/80"
                          }`}
                        >
                          {flag}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-xs truncate">
                              {parsed.name}
                            </span>
                            <span className="text-[10px] bg-muted/80 px-1 py-0.2 rounded text-muted-foreground shrink-0 font-mono">
                              {parsed.commission.split(" ")[0]}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                            <span className="truncate max-w-[130px]">
                              {parsed.arabicName || parsed.region}
                            </span>
                            {parsed.url && (
                              <a
                                href={parsed.url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-primary hover:underline ml-auto"
                                title="Open site"
                              >
                                ↗
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </InnerSidebarItem>
                  );
                })
              )}
            </InnerSidebarList>
          </InnerSidebar>
        }
      >
        {/* Main Content Area */}
        {editingPlatform ? (
          <div className="h-full overflow-y-auto scrollbar-thin p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 text-2xl flex items-center justify-center shadow-xs">
                  {getPlatformFlag(editingPlatform.regionCode)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs uppercase tracking-wider font-semibold text-primary">
                      {editingPlatform.region}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        getStatusBadge(editingPlatform.status).className
                      }`}
                    >
                      {getStatusBadge(editingPlatform.status).label}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    {editingPlatform.name}
                    {editingPlatform.arabicName && (
                      <span className="text-base text-muted-foreground font-normal">
                        ({editingPlatform.arabicName})
                      </span>
                    )}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {editingPlatform.url && editingPlatform.url !== "https://" && (
                  <Button
                    size="sm"
                    variant="outline"
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
                    size="sm"
                    variant="secondary"
                    asChild
                    className="flex items-center gap-1.5 text-xs h-9"
                  >
                    <a
                      href={editingPlatform.myProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <UserCheck className="size-3.5 text-emerald-500" /> My Profile
                    </a>
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setPendingDeleteId(editingPlatform.id)}
                  className="flex items-center gap-1.5 text-xs h-9"
                >
                  <Trash2 className="size-3.5" /> Delete
                </Button>

                <Button
                  size="sm"
                  onClick={handleSavePlatform}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 text-xs h-9 font-semibold"
                >
                  <Save className="size-3.5" /> {isSaving ? "Saving..." : "Save Platform"}
                </Button>
              </div>
            </div>

            {/* Quick Switch Preset Bar */}
            <div className="p-3 bg-muted/30 border border-border/50 rounded-xl flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium shrink-0">
                <Sparkles className="size-3.5 text-primary" /> Switch to preset:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {PRESET_PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setEditingPlatform({
                        ...editingPlatform,
                        name: p.name,
                        arabicName: p.arabicName,
                        region: p.region,
                        regionCode: p.regionCode,
                        url: p.url,
                        commission: p.commission,
                        description: p.description,
                        bestFor: p.bestFor,
                        specialties: [...p.specialties],
                        tags: [...p.tags],
                      });
                      toast.info(`Switched to template: ${p.name}`);
                    }}
                    className="text-[11px] px-2 py-1 rounded-md bg-card border border-border/60 hover:border-primary/50 hover:bg-muted transition-colors whitespace-nowrap"
                  >
                    {getPlatformFlag(p.regionCode)} {p.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 1: Platform Essentials */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Building className="size-4 text-primary" /> Platform Information & Links
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Platform Name
                  </label>
                  <Input
                    type="text"
                    value={editingPlatform.name}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, name: e.target.value })
                    }
                    placeholder="e.g. Upwork, Fiverr, منصة صبار"
                    className="font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Location / Region
                  </label>
                  <select
                    value={editingPlatform.region}
                    onChange={(e) => {
                      const region = e.target.value as any;
                      const regionCode =
                        region.includes("Saudi") ? "sa" : region.includes("Egypt") ? "eg" : "global";
                      setEditingPlatform({ ...editingPlatform, region, regionCode });
                    }}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Global 🌐">Global 🌐</option>
                    <option value="Egypt 🇪🇬">Egypt 🇪🇬</option>
                    <option value="Saudi Arabia 🇸🇦">Saudi Arabia 🇸🇦</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <ExternalLink className="size-3 text-primary" /> Official Website URL
                  </label>
                  <Input
                    type="url"
                    value={editingPlatform.url}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, url: e.target.value })
                    }
                    placeholder="https://www.upwork.com"
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <UserCheck className="size-3 text-emerald-500" /> My Profile / Store URL
                  </label>
                  <Input
                    type="url"
                    value={editingPlatform.myProfileUrl || ""}
                    onChange={(e) =>
                      setEditingPlatform({
                        ...editingPlatform,
                        myProfileUrl: e.target.value,
                      })
                    }
                    placeholder="e.g. https://www.upwork.com/freelancers/~0123abc"
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Percent className="size-3 text-amber-500" /> Commission & Fees
                  </label>
                  <Input
                    type="text"
                    value={editingPlatform.commission}
                    onChange={(e) =>
                      setEditingPlatform({
                        ...editingPlatform,
                        commission: e.target.value,
                      })
                    }
                    placeholder="e.g. 10% Flat Fee, 0% Commission, Hourly shift pay"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Account Status
                  </label>
                  <select
                    value={editingPlatform.status}
                    onChange={(e) =>
                      setEditingPlatform({
                        ...editingPlatform,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="active">Active Account ✅</option>
                    <option value="top_rated">Top Rated / Pro ⭐</option>
                    <option value="applied">Application Pending ⏳</option>
                    <option value="exploring">Exploring 🔍</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: What It's Best For & Overview */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" /> What This Platform Is Best For
              </h2>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Key Value Proposition / Best For
                  </label>
                  <Input
                    type="text"
                    value={editingPlatform.bestFor}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, bestFor: e.target.value })
                    }
                    placeholder="e.g. Enterprise contracts, fast hourly shifts, packaged landing pages"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Platform Overview & Operating Notes
                  </label>
                  <TextArea
                    value={editingPlatform.description}
                    onChange={(e) =>
                      setEditingPlatform({
                        ...editingPlatform,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full text-sm leading-relaxed"
                    placeholder="Describe how payment escrow works, client communication norms, and tips for landing jobs here..."
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Accepted Specialties & Skills */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Layers className="size-4 text-primary" /> Key Specialties & Demanded Skills
              </h2>

              <div className="flex flex-wrap items-center gap-1.5 min-h-[32px]">
                {editingPlatform.specialties.map((spec, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(idx)}
                      className="hover:text-destructive ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Input
                  type="text"
                  value={newSpecialtyInput}
                  onChange={(e) => setNewSpecialtyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSpecialty();
                    }
                  }}
                  placeholder="Add specialty (e.g. Next.js, Mobile Apps, UI Design)..."
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleAddSpecialty}
                  className="shrink-0 text-xs h-9"
                >
                  <Plus className="size-3.5 mr-1" /> Add Specialty
                </Button>
              </div>
            </div>

            {/* Section 4: Tags & Keywords */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Tag className="size-4 text-primary" /> Tags & Categories
              </h2>

              <div className="flex flex-wrap items-center gap-1.5 min-h-[32px]">
                {editingPlatform.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-md"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tag (e.g. Escrow, Remote, Saudi Market, Instant Pay)..."
                  className="text-sm"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleAddTag}
                  className="shrink-0 text-xs h-9"
                >
                  <Plus className="size-3.5 mr-1" /> Add Tag
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Globe className="size-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">No Platform Selected</h2>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Track global freelance marketplaces (Upwork, Fiverr, Toptal, Guru), Egyptian portals (Aykhedmah, Picalica, Tasmeem ME, Mowzaf), and Saudi platforms (صبار, شفتات, بارت تايم, PTway, بحر).
            </p>
            <div className="flex items-center gap-3">
              <Button onClick={() => handleCreateNewPlatform()} className="text-xs">
                <Plus className="size-4 mr-1.5" /> Add Custom Platform
              </Button>
              <Button
                variant="outline"
                onClick={handleLoadPresets}
                className="text-xs border-primary/30 text-primary hover:bg-primary/10"
              >
                <Sparkles className="size-4 mr-1.5" /> Load All 22 Platforms
              </Button>
            </div>
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
