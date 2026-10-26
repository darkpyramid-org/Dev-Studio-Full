import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { SplitLayout } from "@/components/layout";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Connector } from "@/types/tools";
import { newId } from "@/lib/store";
import {
  PRESET_SERVICES,
  SERVICE_CATEGORIES,
} from "@/constants/services-presets";
import {
  parseServiceConnector,
  serializeServiceConnector,
  type ParsedService,
} from "../service-helpers";
import { ServiceSidebar } from "./service-sidebar";
import { ServiceDetailView } from "./service-detail-view";

export interface ServicesCatalogProps {
  connectors: Connector[];
  onUpsert: (connector: Connector) => void;
  onDelete: (id: string) => void;
}

export function ServicesCatalog({
  connectors,
  onUpsert,
  onDelete,
}: ServicesCatalogProps) {
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

  // Sync active item into local edit state
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
        parsed.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parsed.whatICanDo.some((task) => task.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" || parsed.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [uniqueServiceConnectors, searchQuery, selectedCategory]);

  // Category filter tabs
  const categoryFilters = useMemo(() => {
    const list = [{ label: "All", value: "all", count: uniqueServiceConnectors.length }];
    for (const cat of SERVICE_CATEGORIES) {
      const count = uniqueServiceConnectors.filter((c) => {
        const parsed = parseServiceConnector(c);
        return parsed.category === cat;
      }).length;
      if (count > 0) {
        list.push({ label: cat.replace(" & ", "/"), value: cat, count });
      }
    }
    return list;
  }, [uniqueServiceConnectors]);

  const handleCreateNewService = () => {
    const defaultCat =
      selectedCategory !== "all" ? selectedCategory : "Full-Stack Development";

    const newService: ParsedService = {
      id: newId("conn"),
      name: "New Service Offering",
      category: defaultCat,
      budget: "$500 - $1,000",
      pricingType: "fixed",
      deliveryTime: "3 - 5 business days",
      description:
        "Comprehensive service package covering planning, technical execution, and client handover.",
      whatICanDo: [
        "Initial requirements analysis and roadmap",
        "Implementation using modern best practices",
        "Testing, verification, and deployment support",
      ],
      tags: [defaultCat],
      updatedAt: Date.now(),
    };

    const connector = serializeServiceConnector(newService);
    onUpsert(connector);
    setActiveId(newService.id);
    setEditingService(newService);
    toast.success("New service created");
  };

  const handleLoadPresets = () => {
    let count = 0;
    for (const preset of PRESET_SERVICES) {
      const exists = uniqueServiceConnectors.some(
        (c) =>
          c.name.trim().toLowerCase() === preset.name.trim().toLowerCase() ||
          c.id === `preset-${preset.id}`
      );
      if (!exists) {
        const service: ParsedService = {
          id: `preset-${preset.id}`,
          name: preset.name,
          category: preset.category,
          budget: preset.budget,
          pricingType: preset.pricingType,
          deliveryTime: preset.deliveryTime,
          description: preset.description,
          whatICanDo: preset.whatICanDo,
          tags: preset.tags,
          updatedAt: Date.now(),
        };
        const connector = serializeServiceConnector(service);
        onUpsert(connector);
        count++;
      }
    }
    if (count > 0) {
      toast.success(`Loaded ${count} service catalog preset${count > 1 ? "s" : ""}`);
    } else {
      toast.info("All service presets are already loaded in your catalog");
    }
  };

  const handleSaveService = () => {
    if (!editingService) return;
    setIsSaving(true);
    try {
      const existing = uniqueServiceConnectors.find((c) => c.id === editingService.id);
      const connector = serializeServiceConnector(editingService, existing?.createdAt);
      onUpsert(connector);
      toast.success(`${editingService.name} saved successfully`);
    } catch {
      toast.error("Failed to save service");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyProposal = () => {
    if (!editingService) return;
    const text = `
### Service Offering: ${editingService.name}
**Category**: ${editingService.category}
**Budget / Investment**: ${editingService.budget} (${editingService.pricingType})
**Delivery Timeline**: ${editingService.deliveryTime}

#### Key Deliverables & Scope:
${editingService.whatICanDo.map((item) => `- ${item}`).join("\n")}

#### Overview & Execution Details:
${editingService.description}
`.trim();

    navigator.clipboard.writeText(text);
    setCopiedProposal(true);
    toast.success("Proposal outline copied to clipboard!");
    setTimeout(() => setCopiedProposal(false), 2500);
  };

  return (
    <div className="flex-1 min-h-0 h-full overflow-hidden">
      <SplitLayout
        sidebarWidth="lg:w-[260px]"
        sidebar={
          <ServiceSidebar
            totalCount={uniqueServiceConnectors.length}
            filteredServices={filteredServices}
            activeId={activeId}
            onSelect={setActiveId}
            onDelete={(id) => setPendingDeleteId(id)}
            onNew={handleCreateNewService}
            onLoadPresets={handleLoadPresets}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categoryFilters={categoryFilters}
          />
        }
      >
        {/* Main Content Area */}
        {editingService ? (
          <ServiceDetailView
            service={editingService}
            onChange={setEditingService}
            onSave={handleSaveService}
            onDelete={(id) => setPendingDeleteId(id)}
            onCopyProposal={handleCopyProposal}
            copiedProposal={copiedProposal}
            isSaving={isSaving}
          />
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

// Named alias for backward compatibility
export const ServicesCatalogView = ServicesCatalog;
