import {
  Table2,
  ExternalLink,
  UserCheck,
  Trash2,
  Save,
  Building,
  DollarSign,
  Target,
  FileText,
  Percent,
  Star,
  Sparkles,
  Award,
  Globe2,
  CheckCircle2,
  Clock,
  Compass,
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
import type { ParsedPlatform } from "../platform-helpers";
import { RegionIcon } from "./platform-badges";
import { DetailHeader, FormRow, FormSectionCard } from "../shared";

export interface PlatformDetailViewProps {
  platform: ParsedPlatform;
  onChange: (updated: ParsedPlatform) => void;
  onSave: () => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  isSaving: boolean;
}

export function PlatformDetailView({
  platform,
  onChange,
  onSave,
  onDelete,
  onBack,
  isSaving,
}: PlatformDetailViewProps) {
  const update = (patch: Partial<ParsedPlatform>) => {
    onChange({ ...platform, ...patch });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Pinned Top Action Header */}
      <DetailHeader
        onBack={onBack}
        backLabel="All Platforms"
        backIcon={<Table2 className="size-3.5 mr-1" />}
        icon={<RegionIcon regionCode={platform.regionCode} className="size-5" />}
        title={platform.name}
        subtitle={platform.arabicName || undefined}
        actions={
          <>
            {platform.url && platform.url !== "https://" && (
              <Button variant="outline" size="sm" asChild className="text-xs h-8 gap-1.5">
                <a href={platform.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-3.5" />
                  Visit Platform
                </a>
              </Button>
            )}
            {platform.myProfileUrl && (
              <Button variant="secondary" size="sm" asChild className="text-xs h-8 gap-1.5">
                <a href={platform.myProfileUrl} target="_blank" rel="noreferrer">
                  <UserCheck className="size-3.5 text-emerald-500" />
                  My Profile
                </a>
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(platform.id)}
              className="text-xs h-8 gap-1.5"
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
            <Button
              onClick={onSave}
              disabled={isSaving}
              size="sm"
              className="text-xs h-8 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              <Save className="size-4" />
              {isSaving ? "Saving..." : "Save Platform"}
            </Button>
          </>
        }
      />

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-8 flex flex-col gap-5">
          {/* Section 1: Platform Information & Links */}
          <FormSectionCard
            title="Platform Information &amp; Links"
            icon={<Building className="size-3.5" />}
          >
            <FormRow label="Platform Name" icon={<Building />} required>
              <Input
                type="text"
                value={platform.name}
                onChange={(e) => update({ name: e.target.value })}
                className="font-medium h-9 text-sm"
                placeholder="e.g. Guru, Upwork, Mostaql"
              />
            </FormRow>

            <FormRow label="Arabic / Native Name" icon={<Globe2 />}>
              <Input
                type="text"
                value={platform.arabicName || ""}
                onChange={(e) => update({ arabicName: e.target.value })}
                className="h-9 text-sm font-sans"
                placeholder="e.g. مستقل, خمسات, منصة صبار"
                dir="auto"
              />
            </FormRow>

            <FormRow label="Operating Region" icon={<RegionIcon regionCode={platform.regionCode} />}>
              <Select
                value={platform.regionCode}
                onValueChange={(val: "global" | "eg" | "sa") => {
                  const regLabel = val === "eg" ? "Egypt" : val === "sa" ? "Saudi Arabia" : "Global";
                  update({ regionCode: val, region: regLabel });
                }}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">
                    <span className="flex items-center gap-2">
                      <RegionIcon regionCode="global" className="size-3.5" /> Global
                    </span>
                  </SelectItem>
                  <SelectItem value="eg">
                    <span className="flex items-center gap-2">
                      <RegionIcon regionCode="eg" className="size-3.5" /> Egypt
                    </span>
                  </SelectItem>
                  <SelectItem value="sa">
                    <span className="flex items-center gap-2">
                      <RegionIcon regionCode="sa" className="size-3.5" /> Saudi Arabia
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormRow>

            <FormRow label="Official Website URL" icon={<ExternalLink />}>
              <Input
                type="url"
                value={platform.url}
                onChange={(e) => update({ url: e.target.value })}
                className="h-9 text-xs font-mono"
                placeholder="https://..."
              />
            </FormRow>

            <FormRow label="My Public Profile URL" icon={<UserCheck />}>
              <Input
                type="url"
                value={platform.myProfileUrl || ""}
                onChange={(e) => update({ myProfileUrl: e.target.value })}
                className="h-9 text-xs font-mono"
                placeholder="https://.../my-profile"
              />
            </FormRow>
          </FormSectionCard>

          {/* Section 2: Financial & Account Status */}
          <FormSectionCard
            title="Financial &amp; Performance"
            icon={<DollarSign className="size-3.5" />}
          >
            <FormRow label="Platform Commission" icon={<Percent />}>
              <Input
                type="text"
                value={platform.commission}
                onChange={(e) => update({ commission: e.target.value })}
                className="h-9 text-xs font-mono"
                placeholder="e.g. 10%, 15-20%, 0%"
              />
            </FormRow>

            <FormRow label="Platform Rating" icon={<Star />}>
              <Select
                value={String(platform.rating || 4)}
                onValueChange={(val) => update({ rating: Number(val) })}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5.0 — Exceptional</SelectItem>
                  <SelectItem value="4.5">4.5 — Excellent</SelectItem>
                  <SelectItem value="4">4.0 — Very Good</SelectItem>
                  <SelectItem value="3.5">3.5 — Good</SelectItem>
                  <SelectItem value="3">3.0 — Average</SelectItem>
                </SelectContent>
              </Select>
            </FormRow>

            <FormRow label="Account Status" icon={<CheckCircle2 />}>
              <Select
                value={platform.status}
                onValueChange={(val: "active" | "top_rated" | "applied" | "exploring") =>
                  update({ status: val })
                }
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="size-3 text-emerald-500" /> Active Account
                    </span>
                  </SelectItem>
                  <SelectItem value="top_rated">
                    <span className="flex items-center gap-2">
                      <Star className="size-3 text-amber-500 fill-amber-500" /> Top Rated
                    </span>
                  </SelectItem>
                  <SelectItem value="applied">
                    <span className="flex items-center gap-2">
                      <Clock className="size-3 text-sky-500" /> Pending Review
                    </span>
                  </SelectItem>
                  <SelectItem value="exploring">
                    <span className="flex items-center gap-2">
                      <Compass className="size-3 text-muted-foreground" /> Exploring
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormRow>
          </FormSectionCard>

          {/* Section 3: Strategic & Matching */}
          <FormSectionCard
            title="Strategic &amp; Matching"
            icon={<Target className="size-3.5" />}
          >
            <FormRow label="Best For / Core Strengths" icon={<Award />}>
              <Input
                type="text"
                value={platform.bestFor}
                onChange={(e) => update({ bestFor: e.target.value })}
                className="h-9 text-xs"
                placeholder="e.g. High-paying global contracts, quick regional gigs"
              />
            </FormRow>

            <FormRow
              label="Specialties / Tags"
              icon={<Sparkles />}
              hint="Comma separated specialties (e.g. Web Development, Full-Stack, UI/UX)"
            >
              <Input
                type="text"
                value={platform.specialties.join(", ")}
                onChange={(e) =>
                  update({
                    specialties: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="h-9 text-xs"
                placeholder="e.g. React, Node.js, Frontend"
              />
            </FormRow>
          </FormSectionCard>

          {/* Section 4: Strategy Notes */}
          <FormSectionCard
            title="Strategy &amp; Proposal Notes"
            icon={<FileText className="size-3.5" />}
          >
            <div className="p-4 sm:p-5">
              <TextArea
                value={platform.description}
                onChange={(e) => update({ description: e.target.value })}
                className="w-full min-h-[140px] text-xs leading-relaxed bg-transparent border-none shadow-none focus-visible:ring-0 p-0 resize-none font-mono"
                placeholder="Add private strategic notes, proposal tips, client follow-up tactics, or verification credentials for this platform..."
              />
            </div>
          </FormSectionCard>

          {/* Footer Metadata */}
          <div className="text-[11px] text-muted-foreground font-mono pb-4">
            Last updated: {new Date(platform.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
