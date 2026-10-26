import { Save, Mail, Phone, User } from "lucide-react";
import type { Connector } from "@/types/tools";
import { Input, TextArea } from "@/features/tools/shared";
import { Button } from "@/components/ui/button";

interface ConnectorEditorProps {
  type: string;
  activeConnector: Connector | null;
  onUpdateConnector: (updates: Partial<Connector>) => void;
  onSave: () => void;
}

export function ConnectorEditor({
  type,
  activeConnector,
  onUpdateConnector,
  onSave,
}: ConnectorEditorProps) {
  if (!activeConnector) {
    return (
      <div className="flex-1 flex items-center justify-center h-full text-muted-foreground">
        Select a contact or create a new one to start editing.
      </div>
    );
  }

  const getTitle = () => {
    switch (type) {
      case "companies":
        return "Company";
      case "hr":
        return "HR Contact";
      case "clients":
        return "Client";
      case "freelance":
        return "Freelance Contact";
      case "services":
        return "Service Provider";
      default:
        return type.replace("-", " ");
    }
  };

  const getNamePlaceholder = () => {
    switch (type) {
      case "companies":
        return "Enter company name...";
      case "freelance":
        return "Enter client or freelance project name...";
      case "services":
        return "Enter service or provider name...";
      default:
        return "Enter contact name...";
    }
  };

  const getNotesPlaceholder = () => {
    switch (type) {
      case "companies":
        return "Add notes about this company...\n\n- Meeting dates\n- Interaction history\n- Important context";
      case "freelance":
        return "Add notes about this freelance engagement...\n\n- Project scope & deliverables\n- Rate & payment milestones\n- Client feedback";
      case "services":
        return "Add notes about this service...\n\n- Service offerings & SLA\n- Pricing & billing cycle\n- Support & account contacts";
      default:
        return "Add notes about this contact...\n\n- Meeting dates\n- Interaction history\n- Important context";
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 py-3.5 sm:px-8 border-b border-border/60 bg-muted/20 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold capitalize">
          {getTitle()} Details
        </h2>
        <Button
          onClick={onSave}
          className="flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Save className="size-4" /> Save Details
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-8 flex flex-col gap-4">
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-sm font-medium text-muted-foreground sm:w-20 shrink-0 flex items-center gap-2">
              <User className="size-4" /> Name:
            </span>
            <Input
              type="text"
              value={activeConnector.name || ""}
              onChange={(e) => onUpdateConnector({ name: e.target.value })}
              className="flex-1 font-medium"
              placeholder={getNamePlaceholder()}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-sm font-medium text-muted-foreground sm:w-20 shrink-0 flex items-center gap-2">
              <Mail className="size-4" /> Email:
            </span>
            <Input
              type="email"
              value={activeConnector.email || ""}
              onChange={(e) => onUpdateConnector({ email: e.target.value })}
              className="flex-1"
              placeholder="email@example.com"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-sm font-medium text-muted-foreground sm:w-20 shrink-0 flex items-center gap-2">
              <Phone className="size-4" /> Phone:
            </span>
            <Input
              type="tel"
              value={activeConnector.phone || ""}
              onChange={(e) => onUpdateConnector({ phone: e.target.value })}
              className="flex-1"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="flex-1 bg-card border border-border rounded-lg p-6 flex flex-col">
          <span className="text-sm font-medium text-muted-foreground mb-3 block">
            Notes & Details:
          </span>
          <TextArea
            value={activeConnector.notes || ""}
            onChange={(e) => onUpdateConnector({ notes: e.target.value })}
            className="w-full flex-1 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 shadow-none text-sm leading-relaxed bg-transparent"
            placeholder={getNotesPlaceholder()}
          />
          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-[11px] text-muted-foreground font-mono">
            <span>Last updated: {new Date(activeConnector.updatedAt).toLocaleString()}</span>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
