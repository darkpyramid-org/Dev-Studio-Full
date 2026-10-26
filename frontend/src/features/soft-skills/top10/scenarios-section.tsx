import { Layers, Plus, Sparkles, AlertCircle, Trash2, Star } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { type Scenario } from "@/types/skills";
import { ScenarioForm } from "@/components/crud/soft-skills";
import { ScenarioCard } from "./scenario-card";

interface ScenariosSectionProps {
  questionId: string;
  scenarios: Scenario[];
  showAddScenario: boolean;
  editingScenarioId: string | null;
  confirmDeleteS: string | null;
  onAddScenario: (data: Omit<Scenario, "id" | "createdAt">) => void;
  onUpdateScenario: (sid: string, data: Partial<Omit<Scenario, "id" | "createdAt">>) => void;
  onDeleteScenario: (sid: string) => void;
  onShowAdd: () => void;
  onHideAdd: () => void;
  onSetEditing: (sid: string | null) => void;
  onSetConfirmDelete: (sid: string | null) => void;
}

export function ScenariosSection({
  scenarios,
  showAddScenario,
  editingScenarioId,
  confirmDeleteS,
  onAddScenario,
  onUpdateScenario,
  onDeleteScenario,
  onShowAdd,
  onHideAdd,
  onSetEditing,
  onSetConfirmDelete,
}: ScenariosSectionProps) {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-lg bg-primary/10 grid place-items-center text-primary shrink-0">
            <Layers className="size-3.5" />
          </div>
          <span className="text-sm font-semibold text-foreground">My Scenarios</span>
          {scenarios.length > 0 && (
            <span className="text-xs text-muted-foreground">· {scenarios.length}</span>
          )}
        </div>
        {!showAddScenario && (
          <button
            onClick={() => {
              onShowAdd();
              onSetEditing(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all"
          >
            <Plus className="size-3" /> Add Scenario
          </button>
        )}
      </div>

      {/* STAR hint */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-muted/30 border border-border/40">
        <Sparkles className="size-3 text-primary/60 shrink-0" />
        <p className="text-[11px] text-muted-foreground">
          Scenarios use the <span className="font-semibold text-foreground">STAR</span> format —{" "}
          <span className="text-blue-400 font-medium">Situation</span>,{" "}
          <span className="text-amber-400 font-medium">Task</span>,{" "}
          <span className="text-primary font-medium">Action</span>,{" "}
          <span className="text-emerald-400 font-medium">Result</span>. Prepare 2–3 per question for
          flexibility.
        </p>
      </div>

      {/* Add form */}
      {showAddScenario && (
        <div className="mb-4">
          <ScenarioForm
            onSave={(data) => {
              onAddScenario(data);
              onHideAdd();
            }}
            onCancel={onHideAdd}
          />
        </div>
      )}

      {/* Scenario list */}
      <div className="space-y-3">
        {scenarios.map((sc) =>
          editingScenarioId === sc.id ? (
            <div key={sc.id}>
              <ScenarioForm
                initial={sc}
                onSave={(data) => {
                  onUpdateScenario(sc.id, data);
                  onSetEditing(null);
                }}
                onCancel={() => onSetEditing(null)}
              />
            </div>
          ) : confirmDeleteS === sc.id ? (
            <div
              key={sc.id}
              className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4 flex items-center gap-3"
            >
              <AlertCircle className="size-4 text-red-400 shrink-0" />
              <p className="flex-1 text-xs text-muted-foreground">
                Delete <span className="font-semibold text-foreground">"{sc.title}"</span>?
              </p>
              <button
                onClick={() => {
                  onDeleteScenario(sc.id);
                  onSetConfirmDelete(null);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
              >
                <Trash2 className="size-3" /> Delete
              </button>
              <button
                onClick={() => onSetConfirmDelete(null)}
                className="px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:bg-muted/60 transition-all"
              >
                Cancel
              </button>
            </div>
          ) : (
            <ScenarioCard
              key={sc.id}
              scenario={sc}
              onEdit={() => {
                onSetEditing(sc.id);
                onHideAdd();
              }}
              onDelete={() => onSetConfirmDelete(sc.id)}
            />
          ),
        )}
      </div>

      {/* Empty state */}
      {scenarios.length === 0 && !showAddScenario && (
        <EmptyState
          icon={Star}
          title="No scenarios yet"
          description="Prepare real stories from your experience using the STAR format."
          action={{ label: "Add Your First Scenario", onClick: onShowAdd, icon: Plus }}
          size="sm"
        />
      )}
    </div>
  );
}
