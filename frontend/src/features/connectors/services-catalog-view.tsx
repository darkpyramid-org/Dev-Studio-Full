import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Save,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Clock,
  DollarSign,
  Tag,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Briefcase,
  ChevronRight,
  ListPlus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, TextArea } from "@/features/tools/shared";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Connector } from "@/types/tools";
import { newId } from "@/lib/store";
import {
  PRESET_SERVICES,
  SERVICE_CATEGORIES,
  type ServicePreset,
} from "@/constants/services-presets";
import {
  parseServiceConnector,
  serializeServiceConnector,
  getServiceIcon,
  type ParsedService,
} from "./service-helpers";
import {
  InnerSidebar,
  InnerSidebarHeader,
  InnerSidebarSearch,
  InnerSidebarList,
  InnerSidebarItem,
  InnerSidebarEmpty,
  SplitLayout,
} from "@/components/layout";

interface ServicesCatalogViewProps {
  connectors: Connector[];
  onUpsert: (connector: Connector) => void;
  onDelete: (id: string) => void;
  onBulkUpsert?: (items: Partial<Connector>[]) => void;
}

export function ServicesCatalogView({
  connectors,
  onUpsert,
  onDelete,
}: ServicesCatalogViewProps) {
  const serviceConnectors = useMemo(
    () => connectors.filter((c) => c.type === "services"),
    [connectors]
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Editable service state
  const [editingService, setEditingService] = useState<ParsedService | null>(null);
  const [newDeliverableInput, setNewDeliverableInput] = useState("");
  const [newTagInput, setNewTagInput] = useState("");
  const [copiedProposal, setCopiedProposal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-select first service when list loads or changes
  useEffect(() => {
    if (serviceConnectors.length > 0) {
      if (!activeId || !serviceConnectors.some((c) => c.id === activeId)) {
        setActiveId(serviceConnectors[0].id);
      }
    } else {
      setActiveId(null);
      setEditingService(null);
    }
  }, [serviceConnectors, activeId]);

  // When activeId changes, parse the connector into editable state
  useEffect(() => {
    if (!activeId) {
      setEditingService(null);
      return;
    }
    const current = serviceConnectors.find((c) => c.id === activeId);
    if (current) {
      setEditingService(parseServiceConnector(current));
    }
  }, [activeId, serviceConnectors]);

  // Filtered services for sidebar
  const filteredServices = useMemo(() => {
    return serviceConnectors.filter((c) => {
      const parsed = parseServiceConnector(c);
      const matchesSearch =
        parsed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parsed.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parsed.whatICanDo.some((item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        parsed.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === "All" || parsed.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [serviceConnectors, searchQuery, selectedCategory]);

  // 1-Click Load All 14 Presets
  const handleLoadPresets = () => {
    const existingNames = new Set(
      serviceConnectors.map((s) => s.name.trim().toLowerCase())
    );

    let addedCount = 0;
    for (const preset of PRESET_SERVICES) {
      if (!existingNames.has(preset.name.trim().toLowerCase())) {
        const id = newId("srv");
        const connector = serializeServiceConnector({
          id,
          name: preset.name,
          category: preset.category,
          budget: preset.budget,
          pricingType: preset.pricingType,
          deliveryTime: preset.deliveryTime,
          description: preset.description,
          whatICanDo: preset.whatICanDo,
          tags: preset.tags,
          updatedAt: Date.now(),
        });
        onUpsert(connector);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      toast.success(`Loaded ${addedCount} services into your catalog!`);
    } else {
      toast.info("All 14 preset services are already in your catalog.");
    }
  };

  // Create new blank or template service
  const handleCreateNewService = (preset?: ServicePreset) => {
    const id = newId("srv");
    const newServiceData: ParsedService = preset
      ? {
          id,
          name: preset.name,
          category: preset.category,
          budget: preset.budget,
          pricingType: preset.pricingType,
          deliveryTime: preset.deliveryTime,
          description: preset.description,
          whatICanDo: [...preset.whatICanDo],
          tags: [...preset.tags],
          updatedAt: Date.now(),
        }
      : {
          id,
          name: "New Custom Service",
          category: "Frontend Development",
          budget: "$500 - $1,000",
          pricingType: "fixed",
          deliveryTime: "3 - 5 business days",
          description: "Clear overview of the client deliverables and business value provided.",
          whatICanDo: [
            "Project architecture review & planning",
            "Core feature implementation and integration",
            "Quality assurance, performance testing & client review",
          ],
          tags: ["Web", "Development"],
          updatedAt: Date.now(),
        };

    const connector = serializeServiceConnector(newServiceData);
    onUpsert(connector);
    setActiveId(id);
    setEditingService(newServiceData);
    toast.success(`Created service "${newServiceData.name}"`);
  };

  // Save changes to database
  const handleSaveService = () => {
    if (!editingService) return;
    setIsSaving(true);
    try {
      const connector = serializeServiceConnector(editingService);
      onUpsert(connector);
      toast.success(`Saved "${editingService.name}"`);
    } catch {
      toast.error("Failed to save service");
    } finally {
      setIsSaving(false);
    }
  };

  // Add / Remove Deliverable item
  const handleAddDeliverable = () => {
    if (!newDeliverableInput.trim() || !editingService) return;
    setEditingService({
      ...editingService,
      whatICanDo: [...editingService.whatICanDo, newDeliverableInput.trim()],
    });
    setNewDeliverableInput("");
  };

  const handleRemoveDeliverable = (index: number) => {
    if (!editingService) return;
    const next = [...editingService.whatICanDo];
    next.splice(index, 1);
    setEditingService({ ...editingService, whatICanDo: next });
  };

  const handleUpdateDeliverable = (index: number, value: string) => {
    if (!editingService) return;
    const next = [...editingService.whatICanDo];
    next[index] = value;
    setEditingService({ ...editingService, whatICanDo: next });
  };

  // Add / Remove Tags
  const handleAddTag = () => {
    if (!newTagInput.trim() || !editingService) return;
    const tag = newTagInput.trim();
    if (!editingService.tags.includes(tag)) {
      setEditingService({
        ...editingService,
        tags: [...editingService.tags, tag],
      });
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      tags: editingService.tags.filter((t) => t !== tagToRemove),
    });
  };

  // Copy Client Proposal to Clipboard
  const handleCopyProposal = () => {
    if (!editingService) return;
    const text = `
💼 SERVICE PROPOSAL: ${editingService.name.toUpperCase()}
─────────────────────────────────────────────
📂 Category: ${editingService.category}
💰 Budget: ${editingService.budget} (${editingService.pricingType.toUpperCase()})
⏱️ Estimated Turnaround: ${editingService.deliveryTime}

📋 WHAT I WILL DO FOR YOU:
${editingService.whatICanDo.map((item, i) => `  ${i + 1}. ${item}`).join("\n")}

🛠️ TECH STACK & TOOLS:
${editingService.tags.map((t) => `  • ${t}`).join("\n")}

📝 OVERVIEW & APPROACH:
${editingService.description}
─────────────────────────────────────────────
Ready to get started? Let's connect and discuss your project timeline!
`.trim();

    navigator.clipboard.writeText(text);
    setCopiedProposal(true);
    toast.success("Proposal copied to clipboard!");
    setTimeout(() => setCopiedProposal(false), 2500);
  };

  const ActiveIcon = editingService
    ? getServiceIcon(editingService.name, editingService.category)
    : Briefcase;

  return (
    <div className="flex-1 min-h-0 h-full overflow-hidden">
      <SplitLayout
        sidebarWidth="lg:w-[320px]"
        sidebar={
          <InnerSidebar>
            <InnerSidebarHeader
              icon={<Briefcase className="size-4 text-primary" />}
              title="My Services"
              count={serviceConnectors.length}
              onAdd={() => handleCreateNewService()}
              addLabel="New Service"
            />

            <InnerSidebarSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search services or capabilities..."
            />

            {/* Category Filter Pills */}
            <div className="px-2 pb-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 border-b border-border/50">
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 1-Click Load 14 Presets Action Bar */}
            {serviceConnectors.length < 14 && (
              <div className="p-2 border-b border-border/40 bg-primary/5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLoadPresets}
                  className="w-full text-xs font-medium flex items-center justify-center gap-1.5 h-8 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Sparkles className="size-3.5" /> Load All 14 Preset Services
                </Button>
              </div>
            )}

            {/* Services List */}
            <InnerSidebarList>
              {filteredServices.length === 0 ? (
                <div className="p-3 text-center">
                  <InnerSidebarEmpty
                    message={
                      searchQuery || selectedCategory !== "All"
                        ? "No matching services found"
                        : "No services cataloged yet"
                    }
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleLoadPresets}
                    className="mt-3 text-xs w-full"
                  >
                    <Sparkles className="size-3.5 mr-1.5" /> Load 14 Presets
                  </Button>
                </div>
              ) : (
                filteredServices.map((c) => {
                  const parsed = parseServiceConnector(c);
                  const Icon = getServiceIcon(parsed.name, parsed.category);
                  const isSelected = c.id === activeId;

                  return (
                    <InnerSidebarItem
                      key={c.id}
                      active={isSelected}
                      onClick={() => setActiveId(c.id)}
                      onDelete={() => setPendingDeleteId(c.id)}
                    >
                      <div className="flex items-center gap-2.5 w-full min-w-0">
                        <div
                          className={`size-7 rounded-md flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground group-hover:text-foreground group-hover:bg-muted/80"
                          }`}
                        >
                          <Icon className="size-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-medium text-xs truncate">
                              {parsed.name}
                            </span>
                            <span className="text-[10px] bg-muted/80 px-1 py-0.2 rounded text-muted-foreground shrink-0 font-mono">
                              {parsed.whatICanDo.length} tasks
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                            <span className="truncate max-w-[110px] font-mono text-primary/80">
                              {parsed.budget}
                            </span>
                            <span>•</span>
                            <span className="truncate max-w-[90px]">
                              {parsed.category}
                            </span>
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
        {editingService ? (
          <div className="h-full overflow-y-auto scrollbar-thin p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs">
                  <ActiveIcon className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-primary">
                      {editingService.category}
                    </span>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">
                      {editingService.budget}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {editingService.name}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyProposal}
                  className="flex items-center gap-1.5 text-xs h-9"
                >
                  {copiedProposal ? (
                    <>
                      <Check className="size-3.5 text-green-500" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> Copy Proposal
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setPendingDeleteId(editingService.id)}
                  className="flex items-center gap-1.5 text-xs h-9"
                >
                  <Trash2 className="size-3.5" /> Delete
                </Button>

                <Button
                  size="sm"
                  onClick={handleSaveService}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 text-xs h-9 font-semibold"
                >
                  <Save className="size-3.5" /> {isSaving ? "Saving..." : "Save Service"}
                </Button>
              </div>
            </div>

            {/* Quick Template Switcher */}
            <div className="p-3 bg-muted/30 border border-border/50 rounded-xl flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Sparkles className="size-3.5 text-amber-500" /> Apply a preset template:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {PRESET_SERVICES.slice(0, 7).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setEditingService({
                        ...editingService,
                        name: p.name,
                        category: p.category,
                        budget: p.budget,
                        pricingType: p.pricingType,
                        deliveryTime: p.deliveryTime,
                        description: p.description,
                        whatICanDo: [...p.whatICanDo],
                        tags: [...p.tags],
                      });
                      toast.info(`Applied template: ${p.name}`);
                    }}
                    className="text-[11px] px-2 py-1 rounded-md bg-card border border-border/60 hover:border-primary/50 hover:bg-muted transition-colors whitespace-nowrap"
                  >
                    {p.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 1: Service Name & Budget Specs */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <DollarSign className="size-4 text-primary" /> Service Offering & Budget
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-foreground">
                    Service Title
                  </label>
                  <Input
                    type="text"
                    value={editingService.name}
                    onChange={(e) =>
                      setEditingService({ ...editingService, name: e.target.value })
                    }
                    placeholder="e.g. Search Engine Optimization (SEO)"
                    className="font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Domain / Category
                  </label>
                  <select
                    value={editingService.category}
                    onChange={(e) =>
                      setEditingService({ ...editingService, category: e.target.value })
                    }
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {SERVICE_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Pricing Model
                  </label>
                  <select
                    value={editingService.pricingType}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        pricingType: e.target.value as any,
                      })
                    }
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring capitalize"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="monthly">Monthly Retainer</option>
                    <option value="starting_at">Starting At</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <DollarSign className="size-3 text-emerald-500" /> Budget / Rate
                  </label>
                  <Input
                    type="text"
                    value={editingService.budget}
                    onChange={(e) =>
                      setEditingService({ ...editingService, budget: e.target.value })
                    }
                    placeholder="e.g. $450 - $1,200 or $75/hr"
                    className="font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Clock className="size-3 text-blue-500" /> Delivery Turnaround
                  </label>
                  <Input
                    type="text"
                    value={editingService.deliveryTime}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        deliveryTime: e.target.value,
                      })
                    }
                    placeholder="e.g. 3 - 5 business days"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: "What I Can Do" (Scope & Deliverables) */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" /> What I Can Do (Scope & Deliverables)
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Clear list of features, audit steps, and deliverables you provide to clients.
                  </p>
                </div>
                <span className="text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full self-start font-semibold">
                  {editingService.whatICanDo.length} Deliverables
                </span>
              </div>

              {/* Deliverables List */}
              <div className="space-y-2">
                {editingService.whatICanDo.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-muted/40 rounded-lg border border-border/40 group hover:border-border transition-colors"
                  >
                    <div className="size-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="size-3.5" />
                    </div>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleUpdateDeliverable(idx, e.target.value)}
                      className="flex-1 bg-transparent text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(idx)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors opacity-70 group-hover:opacity-100"
                      title="Remove deliverable"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Deliverable */}
              <div className="flex items-center gap-2 pt-2">
                <Input
                  type="text"
                  value={newDeliverableInput}
                  onChange={(e) => setNewDeliverableInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddDeliverable();
                    }
                  }}
                  placeholder="Type a new deliverable (e.g. Full technical SEO crawl & sitemap generation)..."
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleAddDeliverable}
                  className="shrink-0 flex items-center gap-1.5 text-xs h-9"
                >
                  <Plus className="size-3.5" /> Add
                </Button>
              </div>
            </div>

            {/* Section 3: Skills, Tools & Tags */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Tag className="size-4 text-primary" /> Skills, Tools & Technologies
              </h2>

              <div className="flex flex-wrap items-center gap-1.5 min-h-[32px]">
                {editingService.tags.map((tag) => (
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
                  placeholder="Add tool or skill tag (e.g. Next.js, Stripe, Docker, Lighthouse)..."
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

            {/* Section 4: Detailed Scope Description & Strategy Notes */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Layers className="size-4 text-primary" /> Service Overview & Strategy Notes
              </h2>
              <p className="text-xs text-muted-foreground">
                In-depth context, communication channels, client prerequisites, or execution milestones.
              </p>
              <TextArea
                value={editingService.description}
                onChange={(e) =>
                  setEditingService({ ...editingService, description: e.target.value })
                }
                rows={4}
                className="w-full text-sm leading-relaxed"
                placeholder="Describe the business value, process, and prerequisites for this service..."
              />
            </div>

            {/* Section 5: Client-Ready Proposal Card */}
            <div className="bg-gradient-to-br from-primary/5 via-card to-card border border-primary/20 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-500" />
                  <h3 className="font-semibold text-sm">Client-Ready Proposal Card</h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyProposal}
                  className="h-8 text-xs flex items-center gap-1.5"
                >
                  {copiedProposal ? (
                    <>
                      <Check className="size-3.5 text-green-500" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> Copy Proposal Summary
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-background/80 border border-border/80 rounded-lg p-4 font-sans text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="font-bold text-sm text-foreground">
                    {editingService.name}
                  </span>
                  <span className="font-mono text-primary font-bold">
                    {editingService.budget}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {editingService.description}
                </p>
                <div className="space-y-1 pt-1">
                  <span className="font-semibold text-foreground block">
                    What is included:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                    {editingService.whatICanDo.slice(0, 4).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                    {editingService.whatICanDo.length > 4 && (
                      <li className="text-primary font-medium">
                        + {editingService.whatICanDo.length - 4} more deliverables
                      </li>
                    )}
                  </ul>
                </div>
                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Turnaround: {editingService.deliveryTime}</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    Active & Available for Hire
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Briefcase className="size-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">No Service Selected</h2>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Create your service catalog with what you can do for clients (SEO, domain, responsive design, security, UI/UX, landing pages, server DevOps, payments, AI, and more).
            </p>
            <div className="flex items-center gap-3">
              <Button onClick={() => handleCreateNewService()} className="text-xs">
                <Plus className="size-4 mr-1.5" /> Create Custom Service
              </Button>
              <Button
                variant="outline"
                onClick={handleLoadPresets}
                className="text-xs border-primary/30 text-primary hover:bg-primary/10"
              >
                <Sparkles className="size-4 mr-1.5" /> Load 14 Presets
              </Button>
            </div>
          </div>
        )}
      </SplitLayout>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        onConfirm={() => {
          if (pendingDeleteId) {
            onDelete(pendingDeleteId);
            setPendingDeleteId(null);
            toast.success("Service deleted");
          }
        }}
      />
    </div>
  );
}
