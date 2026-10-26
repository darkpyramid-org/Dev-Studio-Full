import {
  Wrench,
  Copy,
  Check,
  Trash2,
  Save,
  Layers,
  DollarSign,
  Clock,
  FileText,
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
import { SERVICE_CATEGORIES } from "@/constants/services-presets";
import type { ParsedService } from "../service-helpers";
import { DetailHeader, FormRow, FormSectionCard } from "../shared";
import { ServiceDeliverables } from "./service-deliverables";

export interface ServiceDetailViewProps {
  service: ParsedService;
  onChange: (updated: ParsedService) => void;
  onSave: () => void;
  onDelete: (id: string) => void;
  onCopyProposal: () => void;
  copiedProposal: boolean;
  isSaving: boolean;
}

export function ServiceDetailView({
  service,
  onChange,
  onSave,
  onDelete,
  onCopyProposal,
  copiedProposal,
  isSaving,
}: ServiceDetailViewProps) {
  const update = (patch: Partial<ParsedService>) => {
    onChange({ ...service, ...patch });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Action Header pinned to top */}
      <DetailHeader
        icon={<Wrench className="size-4 text-primary" />}
        title={`${service.name} Details`}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyProposal}
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
              onClick={() => onDelete(service.id)}
              className="flex items-center gap-1.5 text-xs h-9"
            >
              <Trash2 className="size-3.5" /> Delete
            </Button>

            <Button
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 text-xs h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              <Save className="size-4" /> {isSaving ? "Saving..." : "Save Details"}
            </Button>
          </>
        }
      />

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-8 flex flex-col gap-5">
          {/* Section 1: Service Specifications */}
          <FormSectionCard
            title="Service Specifications"
            icon={<Wrench className="size-3.5" />}
          >
            <FormRow label="Service Title" icon={<Wrench />} required>
              <Input
                type="text"
                value={service.name}
                onChange={(e) => update({ name: e.target.value })}
                className="font-medium h-9 text-sm"
                placeholder="e.g. Full-Stack Web Application, UI/UX Design Studio"
              />
            </FormRow>

            <FormRow label="Domain / Category" icon={<Layers />}>
              <Select
                value={service.category}
                onValueChange={(val) => update({ category: val })}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Category..." />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>

            <FormRow label="Pricing Model" icon={<DollarSign />}>
              <Select
                value={service.pricingType}
                onValueChange={(val: any) => update({ pricingType: val })}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Price</SelectItem>
                  <SelectItem value="hourly">Hourly Rate</SelectItem>
                  <SelectItem value="monthly">Monthly Retainer</SelectItem>
                  <SelectItem value="starting_at">Starting At</SelectItem>
                </SelectContent>
              </Select>
            </FormRow>

            <FormRow label="Budget / Rate" icon={<DollarSign />}>
              <Input
                type="text"
                value={service.budget}
                onChange={(e) => update({ budget: e.target.value })}
                className="h-9 text-xs font-mono"
                placeholder="e.g. $1,500 - $3,000, $50/hr"
              />
            </FormRow>

            <FormRow label="Delivery Time" icon={<Clock />}>
              <Input
                type="text"
                value={service.deliveryTime}
                onChange={(e) => update({ deliveryTime: e.target.value })}
                className="h-9 text-xs"
                placeholder="e.g. 5 - 7 business days, 2 weeks"
              />
            </FormRow>
          </FormSectionCard>

          {/* Section 2: Deliverables Checklist */}
          <ServiceDeliverables
            items={service.whatICanDo}
            onChange={(items) => update({ whatICanDo: items })}
          />

          {/* Section 3: Notes & Client Scope */}
          <div className="bg-card border border-border/80 rounded-xl p-5 sm:p-6 flex flex-col gap-4 min-h-[220px] shadow-xs hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2">
              <FileText className="size-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Notes &amp; Client Scope Details
              </span>
            </div>

            <TextArea
              value={service.description}
              onChange={(e) => update({ description: e.target.value })}
              className="w-full flex-1 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 shadow-none text-sm leading-relaxed bg-transparent min-h-[120px]"
              placeholder="Add notes about client scope, prerequisites, technical stack, or implementation strategy..."
            />

            <div className="pt-3 border-t border-border/50 flex justify-between items-center text-[11px] text-muted-foreground font-mono">
              <span>Last updated: {new Date(service.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
