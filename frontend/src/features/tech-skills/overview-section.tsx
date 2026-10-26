import type { SkillAreaData } from "@/types/skills";
import { TabNav } from "@/components/layout";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen } from "lucide-react";

interface Props {
  data: SkillAreaData;
  subArea: string;
  onSubAreaChange: (id: string) => void;
  hideSubAreaNav?: boolean;
}

export function OverviewSection({ data, subArea, onSubAreaChange, hideSubAreaNav = false }: Props) {
  const saData = data.subAreas?.find((sa) => sa.id === subArea);
  const concepts = saData?.concepts || data.concepts;

  return (
    <div className="space-y-10">
      {/* Sub-area selector */}

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          {saData ? saData.label : "Technical Overview"}
        </h2>
        <p className="text-muted-foreground leading-relaxed">{data.description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {concepts.map((c) => (
          <div
            key={c.title}
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors shadow-sm"
          >
            <h3 className="text-sm font-semibold mb-2">{c.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{c.body}</p>
          </div>
        ))}
        {concepts.length === 0 && (
          <div className="col-span-2">
            <EmptyState
              icon={BookOpen}
              title="Select a topic"
              description="Choose a topic from the sidebar to view key concepts."
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
