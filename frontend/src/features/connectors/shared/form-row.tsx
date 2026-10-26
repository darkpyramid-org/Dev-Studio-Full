import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormRowProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
  className?: string;
}

export function FormRow({
  label,
  icon,
  children,
  hint,
  required,
  className,
}: FormRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-[180px_1fr] md:grid-cols-[220px_1fr] transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-muted/15 text-xs sm:text-sm font-medium text-muted-foreground border-b sm:border-b-0 sm:border-r border-border/40">
        {icon && <span className="size-3.5 shrink-0 text-muted-foreground/80">{icon}</span>}
        <span className="truncate">{label}</span>
        {required && <span className="text-destructive font-bold text-xs">*</span>}
      </div>

      <div className="px-4 py-2 sm:py-2.5 flex flex-col justify-center gap-1 min-w-0">
        {children}
        {hint && <span className="text-[11px] text-muted-foreground/60">{hint}</span>}
      </div>
    </div>
  );
}
