import { useState } from "react";
import { Check, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/features/tools/shared";

export interface ServiceDeliverablesProps {
  items: string[];
  onChange: (items: string[]) => void;
}

export function ServiceDeliverables({ items, onChange }: ServiceDeliverablesProps) {
  const [newDeliverableInput, setNewDeliverableInput] = useState("");

  const handleAdd = () => {
    const text = newDeliverableInput.trim();
    if (!text) return;
    onChange([...items, text]);
    setNewDeliverableInput("");
  };

  const handleUpdate = (index: number, val: string) => {
    const next = [...items];
    next[index] = val;
    onChange(next);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-card border border-border/80 rounded-xl p-5 sm:p-6 flex flex-col gap-4 shadow-xs hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <CheckCircle2 className="size-3.5 text-primary" />
          What I Can Do (Deliverables)
        </span>
        <span className="text-[11px] font-mono text-muted-foreground/80">
          {items.length} {items.length === 1 ? "deliverable" : "deliverables"}
        </span>
      </div>

      {/* Deliverables List */}
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 p-2.5 bg-muted/30 rounded-lg border border-border/50 group hover:border-primary/40 transition-colors"
          >
            <Check className="size-4 text-primary shrink-0" />
            <input
              type="text"
              value={item}
              onChange={(e) => handleUpdate(idx, e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none text-foreground"
              placeholder="Describe deliverable..."
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors opacity-70 group-hover:opacity-100"
              title="Remove deliverable"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Deliverable Input */}
      <div className="flex items-center gap-2 pt-1">
        <Input
          type="text"
          value={newDeliverableInput}
          onChange={(e) => setNewDeliverableInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Type new deliverable and press Enter..."
          className="text-sm h-9"
        />
        <Button
          size="sm"
          onClick={handleAdd}
          className="shrink-0 text-xs h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          <Plus className="size-3.5 mr-1" /> Add
        </Button>
      </div>
    </div>
  );
}
