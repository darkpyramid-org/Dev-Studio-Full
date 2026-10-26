import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  Wrench,
  Plus,
  Trash2,
  Save,
  Copy,
  Check,
  Sparkles,
  DollarSign,
  Clock,
  Layers,
  CheckCircle2,
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
  InnerSidebarFilters,
  InnerSidebarDivider,
  InnerSidebarList,
  InnerSidebarItem,
  InnerSidebarEmpty,
  InnerSidebarAddButton,
  SplitLayout,
} from "@/components/layout";

interface ServicesCatalogViewProps {
  connectors: Connector[];
  onUpsert: (connector: Connector) => void;
  onDelete: (id: string) => void;
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

  // Deduplicate by normalized name
  const uniqueServiceConnectors = useMemo(() => {
    const seen = new Set<string>();
    const list: Connector[] = [];
    for (const c of serviceConnectors) {
      const key = (c.name || "").trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(c);
      }
    }
    return list;
  }, [serviceConnectors]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Editable service state
  const [editingService, setEditingService] = useState<ParsedService | null>(null);
  const [newDeliverableInput, setNewDeliverableInput] = useState("");
  const [copiedProposal, setCopiedProposal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-select first service
  useEffect(() => {
    if (uniqueServiceConnectors.length > 0) {
      if (!activeId || !uniqueServiceConnectors.some((c) => c.id === activeId)) {
        setActiveId(uniqueServiceConnectors[0].id);
      }
    } else {
      setActiveId(null);
      setEditingService(null);
    }
  }, [uniqueServiceConnectors, activeId]);

  // When activeId changes, parse the connector into editable state
  useEffect(() => {
    if (!activeId) {
      setEditingService(null);
      return;
    }
    const current = uniqueServiceConnectors.find((c) => c.id === activeId);
    if (current) {
      setEditingService(parseServiceConnector(current));
    }
  }, [activeId, uniqueServiceConnectors]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return uniqueServiceConnectors.filter((c) => {
      const parsed = parseServiceConnector(c);
      const matchesSearch =
        parsed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parsed.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parsed.whatICanDo.some((item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCat =
        selectedCategory === "all" ||
        parsed.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [uniqueServiceConnectors, searchQuery, selectedCategory]);

  // Category filter items for InnerSidebarFilters
  const categoryFilters = useMemo(() => {
    const list = [
      { label: "All", value: "all", count: uniqueServiceConnectors.length },
    ];
    for (const cat of SERVICE_CATEGORIES) {
      if (cat === "All") continue;
      const count = uniqueServiceConnectors.filter(
        (c) => parseServiceConnector(c).category === cat
      ).length;
      list.push({ label: cat.split(" ")[0], value: cat, count });
    }
    return list;
  }, [uniqueServiceConnectors]);

  // 1-Click Load All 14 Presets (deduplicated)
  const handleLoadPresets = () => {
    const existingNames = new Set(
      uniqueServiceConnectors.map((s) => s.name.trim().toLowerCase())
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
      toast.info("All 14 preset services are already loaded.");
    }
  };

  // Create new service
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
          description: "Clear overview of client deliverables and business value provided.",
          whatICanDo: [
            "Project architecture review & planning",
            "Core feature implementation and integration",
            "Testing, verification, and final client sign-off",
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

  // Save changes
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

  // Deliverables
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

  // Copy Proposal
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

📝 OVERVIEW:
${editingService.description}
`.trim();

    navigator.clipboard.writeText(text);
    setCopiedProposal(true);
    toast.success("Proposal copied to clipboard!");
    setTimeout(() => setCopiedProposal(false), 2500);
  };

  return (
    <div className="flex-1 min-h-0 h-full overflow-hidden">
      <SplitLayout
        sidebarWidth="lg:w-[260px]"
        sidebar={
          <InnerSidebar>
            <InnerSidebarHeader
              icon={<Wrench className="size-3.5" />}
              title="Services"
              count={uniqueServiceConnectors.length}
              onAdd={() => handleCreateNewService()}
              addLabel="New Service"
            />

            <InnerSidebarSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search services..."
            />

            <div className="pt-1.5 pb-1">
              <InnerSidebarFilters
                wrap={true}
                filters={categoryFilters}
                active={selectedCategory}
                onChange={setSelectedCategory}
              />
            </div>

            <InnerSidebarDivider />

            {/* Presets loader pill if missing */}
            {uniqueServiceConnectors.length < 14 && (
              <div className="p-2 border-b border-border/40 bg-primary/5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLoadPresets}
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
                    onClick={handleLoadPresets}
                    className="mt-3 text-xs w-full"
                  >
                    <Sparkles className="size-3.5 mr-1.5" /> Load 14 Presets
                  </Button>
                </div>
              ) : (
                filteredServices.map((c) => {
                  const parsed = parseServiceConnector(c);
                  const isSelected = c.id === activeId;

                  return (
                    <InnerSidebarItem
                      key={c.id}
                      active={isSelected}
                      onClick={() => setActiveId(c.id)}
                      onDelete={() => setPendingDeleteId(c.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs truncate">
                          {parsed.name}
                        </div>
                        <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                          {parsed.category}
                        </div>
                        <div className="text-[9px] text-muted-foreground/60 mt-0.5 font-mono flex items-center justify-between">
                          <span>{parsed.budget}</span>
                          <span>{parsed.whatICanDo.length} tasks</span>
                        </div>
                      </div>
                    </InnerSidebarItem>
                  );
                })
              )}
            </InnerSidebarList>

            <InnerSidebarAddButton
              onClick={() => handleCreateNewService()}
              label="New Service"
            />
          </InnerSidebar>
        }
      >
        {/* Main Content Area */}
        {editingService ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Top Action Header pinned to top */}
            <div className="px-5 py-3.5 sm:px-8 border-b border-border/60 bg-muted/20 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold capitalize">
                {editingService.name} Details
              </h2>

              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyProposal}
                  className="flex items-center gap-1.5 text-xs h-9"
                >
                  {copiedProposal ? (
                    <>
                      <Check className="size-3.5 text-emerald-500" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> Copy Proposal
                    </>
                  )}
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setPendingDeleteId(editingService.id)}
                  className="flex items-center gap-1.5 text-xs h-9"
                >
                  <Trash2 className="size-3.5" /> Delete
                </Button>

                <Button
                  onClick={handleSaveService}
                  disabled={isSaving}
                  className="flex items-center gap-2 text-xs h-9"
                >
                  <Save className="size-4" /> {isSaving ? "Saving..." : "Save Details"}
                </Button>
              </div>
            </div>

            {/* Form & Notes Content - scrollbar placed right along card border */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-8 flex flex-col gap-4">
                {/* Form Card */}
                <div className="bg-card border border-border rounded-lg p-4 sm:p-6 flex flex-col gap-4">
                {/* Service Name */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm font-medium text-muted-foreground sm:w-36 shrink-0 flex items-center gap-2">
                    <Wrench className="size-4" /> Service Title:
                  </span>
                  <Input
                    type="text"
                    value={editingService.name}
                    onChange={(e) =>
                      setEditingService({ ...editingService, name: e.target.value })
                    }
                    className="flex-1 font-medium"
                    placeholder="e.g. Search Engine Optimization (SEO)"
                  />
                </div>

                {/* Domain / Category (Reusable Select) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm font-medium text-muted-foreground sm:w-36 shrink-0 flex items-center gap-2">
                    <Layers className="size-4" /> Domain / Category:
                  </span>
                  <div className="flex-1">
                    <Select
                      value={editingService.category}
                      onValueChange={(cat) =>
                        setEditingService({ ...editingService, category: cat })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pricing Model (Reusable Select) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm font-medium text-muted-foreground sm:w-36 shrink-0 flex items-center gap-2">
                    <DollarSign className="size-4" /> Pricing Model:
                  </span>
                  <div className="flex-1">
                    <Select
                      value={editingService.pricingType}
                      onValueChange={(val: any) =>
                        setEditingService({ ...editingService, pricingType: val })
                      }
                    >
                      <SelectTrigger className="w-full capitalize">
                        <SelectValue placeholder="Select pricing model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                        <SelectItem value="monthly">Monthly Retainer</SelectItem>
                        <SelectItem value="starting_at">Starting At</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Budget / Price */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm font-medium text-muted-foreground sm:w-36 shrink-0 flex items-center gap-2">
                    <DollarSign className="size-4" /> Budget / Rate:
                  </span>
                  <Input
                    type="text"
                    value={editingService.budget}
                    onChange={(e) =>
                      setEditingService({ ...editingService, budget: e.target.value })
                    }
                    className="flex-1 font-mono"
                    placeholder="e.g. $450 - $1,200 or $75/hr"
                  />
                </div>

                {/* Turnaround / Delivery Time */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm font-medium text-muted-foreground sm:w-36 shrink-0 flex items-center gap-2">
                    <Clock className="size-4" /> Delivery Time:
                  </span>
                  <Input
                    type="text"
                    value={editingService.deliveryTime}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        deliveryTime: e.target.value,
                      })
                    }
                    className="flex-1"
                    placeholder="e.g. 3 - 5 business days"
                  />
                </div>
              </div>

              {/* What I Can Do (Deliverables) Card */}
              <div className="bg-card border border-border rounded-lg p-4 sm:p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" /> What I Can Do (Deliverables):
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {editingService.whatICanDo.length} items
                  </span>
                </div>

                <div className="space-y-2">
                  {editingService.whatICanDo.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-muted/40 rounded-lg border border-border/40 group hover:border-border transition-colors"
                    >
                      <Check className="size-3.5 text-emerald-500 shrink-0" />
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

                <div className="flex items-center gap-2 pt-1">
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
                    placeholder="Type new deliverable and press Enter..."
                    className="text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddDeliverable}
                    className="shrink-0 text-xs h-9"
                  >
                    <Plus className="size-3.5 mr-1" /> Add
                  </Button>
                </div>
              </div>

              {/* Notes & Details Card */}
              <div className="flex-1 bg-card border border-border rounded-lg p-6 flex flex-col gap-4 min-h-[200px]">
                <div className="flex-1 flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground mb-2 block">
                    Notes & Details:
                  </span>
                  <TextArea
                    value={editingService.description}
                    onChange={(e) =>
                      setEditingService({ ...editingService, description: e.target.value })
                    }
                    className="w-full flex-1 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 shadow-none text-sm leading-relaxed bg-transparent min-h-[100px]"
                    placeholder="Add notes about client scope, prerequisites, or implementation strategy..."
                  />
                </div>

                <div className="pt-4 border-t border-border flex justify-between items-center text-[11px] text-muted-foreground font-mono">
                  <span>Last updated: {new Date(editingService.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
          <div className="flex-1 flex items-center justify-center h-full text-muted-foreground">
            Select a service or create a new one to start editing.
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
