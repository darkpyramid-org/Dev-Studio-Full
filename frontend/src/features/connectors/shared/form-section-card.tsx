import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormSectionCardProps {
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

export function FormSectionCard({
  title,
  icon,
  badge,
  children,
  className,
  description,
}: FormSectionCardProps) {
  return (
    <section
      className={cn(
        "bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs hover:border-primary/30 transition-colors",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border/60 bg-muted/25">
        <div className="flex items-center gap-2">
          {icon && <span className="size-3.5 text-primary shrink-0">{icon}</span>}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </h3>
            {description && (
              <p className="text-[11px] text-muted-foreground/70 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {badge && <div>{badge}</div>}
      </div>

      <div className="divide-y divide-border/40">{children}</div>
    </section>
  );
}
