import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DetailHeaderProps {
  /** Optional back button handler, e.g. "All Platforms" */
  onBack?: () => void;
  backLabel?: string;
  backIcon?: React.ReactNode;
  /** Primary title icon or badge */
  icon?: React.ReactNode;
  /** Entity title */
  title: string;
  /** Subtitle or secondary badge (e.g. Arabic title, category) */
  subtitle?: React.ReactNode;
  /** Action buttons rendered on the right */
  actions?: React.ReactNode;
}

export function DetailHeader({
  onBack,
  backLabel = "Back",
  backIcon,
  icon,
  title,
  subtitle,
  actions,
}: DetailHeaderProps) {
  return (
    <header className="px-5 py-3.5 sm:px-8 border-b border-border/60 bg-muted/20 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Title & Navigation */}
      <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
        {onBack && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={onBack}
              className="h-8 text-xs px-2 text-muted-foreground hover:text-foreground shrink-0"
            >
              {backIcon}
              {backLabel}
            </Button>
            <ChevronRight className="size-3.5 text-muted-foreground/40 shrink-0" />
          </>
        )}

        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="shrink-0">{icon}</span>}
          <h2 className="text-base sm:text-lg font-semibold truncate">{title}</h2>
          {subtitle && (
            <span className="text-xs text-muted-foreground shrink-0 font-normal">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {actions && (
        <div className="flex items-center gap-2 flex-wrap sm:shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
}
