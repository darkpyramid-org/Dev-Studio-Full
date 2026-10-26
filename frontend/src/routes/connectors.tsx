import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { PageHeader, PageContainer, PageSection, TabNav, SplitLayout } from "@/components/layout";
import { Users } from "lucide-react";
import { z } from "zod";
import { useForge, newId } from "@/lib/store";
import { ConnectorsSidebar } from "@/features/connectors/connectors-sidebar";
import { ConnectorEditor } from "@/components/crud/connectors";
import { ServicesCatalogView } from "@/features/connectors/services-catalog-view";
import { PlatformsCatalogView } from "@/features/connectors/platforms-catalog-view";
import type { Connector } from "@/types/tools";
import { CONNECTORS_TABS } from "@/constants";
import { ConnectorType } from "@shared/enums";

const connectorsSearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute("/connectors")({
  validateSearch: connectorsSearchSchema,
  head: () => ({
    meta: [{ title: "Connectors & Services — Dev Studio" }],
  }),
  component: ConnectorsPage,
});

function ConnectorsPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const tab = (search.tab || "companies") as ConnectorType;

  const { connectors, upsertConnector, deleteConnector } = useForge();
  const [activeConnectorId, setActiveConnectorId] = useState<string | null>(null);
  // Local edit state — tracks uncommitted field changes without firing API calls per keystroke
  const [localEdits, setLocalEdits] = useState<Partial<Connector>>({});
  const prevActiveId = useRef<string | null>(null);

  // Auto-select first connector when switching tabs or after list changes
  useEffect(() => {
    const tabConnectors = connectors.filter((c) => c.type === tab);
    if (tabConnectors.length > 0 && !tabConnectors.some((c) => c.id === activeConnectorId)) {
      setActiveConnectorId(tabConnectors[0].id);
    } else if (tabConnectors.length === 0) {
      setActiveConnectorId(null);
    }
  }, [tab, connectors, activeConnectorId]);

  // Clear local edits when switching between connectors
  useEffect(() => {
    if (prevActiveId.current !== activeConnectorId) {
      setLocalEdits({});
      prevActiveId.current = activeConnectorId;
    }
  }, [activeConnectorId]);

  const handleNewConnector = () => {
    const defaultName =
      tab === "companies"
        ? "New Company"
        : tab === "freelance"
          ? "New Freelance Contact"
          : tab === "clients"
            ? "New Client"
            : "New Contact";

    const next: Connector = {
      id: newId("conn"),
      type: tab,
      name: defaultName,
      email: "",
      phone: "",
      notes: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    // Save new connector to backend immediately
    upsertConnector(next);
    setActiveConnectorId(next.id);
    setLocalEdits({});
  };

  // Only update local React state — no API call on each keystroke
  const handleUpdateConnector = (updates: Partial<Connector>) => {
    setLocalEdits((prev) => ({ ...prev, ...updates }));
  };

  // Explicit save — merges local edits into store and fires the API call once
  const handleSaveConnector = () => {
    const current = connectors.find((c) => c.id === activeConnectorId);
    if (!current) return;
    const merged = { ...current, ...localEdits, updatedAt: Date.now() };
    upsertConnector(merged);
    setLocalEdits({});
  };

  const storedConnector = connectors.find((c) => c.id === activeConnectorId) || null;
  // Show the editor with local edits overlaid on the stored data
  const activeConnector = storedConnector ? { ...storedConnector, ...localEdits } : null;

  return (
    <PageContainer>
      <PageSection>
        <PageHeader icon={Users} title="Connectors & Services" className="mb-4" />
        <TabNav
          tabs={CONNECTORS_TABS.map((t) => ({
            ...t,
            onClick: () => navigate({ to: ".", search: { tab: t.id } }),
          }))}
          activeTab={tab}
        />
      </PageSection>

      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === "platforms" ? (
          <PlatformsCatalogView
            connectors={connectors}
            onUpsert={upsertConnector}
            onDelete={deleteConnector}
          />
        ) : tab === "services" ? (
          <ServicesCatalogView
            connectors={connectors}
            onUpsert={upsertConnector}
            onDelete={deleteConnector}
          />
        ) : (
          <SplitLayout
            sidebar={
              <ConnectorsSidebar
                type={tab}
                connectors={connectors}
                activeConnectorId={activeConnectorId}
                onSelectConnector={setActiveConnectorId}
                onNewConnector={handleNewConnector}
                onDeleteConnector={deleteConnector}
              />
            }
            sidebarWidth="lg:w-[260px]"
            className=""
          >
            <div className="overflow-y-auto scrollbar-thin h-full w-full">
              <ConnectorEditor
                type={tab}
                activeConnector={activeConnector}
                onUpdateConnector={handleUpdateConnector}
                onSave={handleSaveConnector}
              />
            </div>
          </SplitLayout>
        )}
      </div>
    </PageContainer>
  );
}
