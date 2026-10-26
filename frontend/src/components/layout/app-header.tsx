import { Link } from "@tanstack/react-router";
import { Languages, Menu, Moon, Plus, Search, Sun } from "lucide-react";
import { ErrorBoundary } from "@/components/errors";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NotificationCenter } from "./notification-center";
import { PresenceIndicator } from "./presence-indicator";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";

/**
 * Top header bar: sidebar toggles, search trigger, presence indicator,
 * theme/language toggles and notifications.
 */
export function AppHeader({
  isCollapsed,
  onOpenMobile,
  onToggleCollapsed,
  onOpenPalette,
}: {
  isCollapsed: boolean;
  onOpenMobile: () => void;
  onToggleCollapsed: () => void;
  onOpenPalette: () => void;
}) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();

  return (
    <header className="shrink-0 flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/60 shadow-sm relative z-[100]">
      {/* Left: sidebar toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenMobile}
          className="md:hidden size-8 grid place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/60"
          aria-label="Open menu"
        >
          <Menu className="size-4" />
        </button>
        <button
          onClick={onToggleCollapsed}
          className="hidden md:grid size-8 place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/60"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="size-4" />
        </button>
      </div>

      {/* Center: search */}
      <button
        onClick={onOpenPalette}
        className="flex items-center gap-2.5 flex-1 min-w-0 max-w-sm text-left px-3 py-1.5 rounded-xl bg-muted/40 border border-border/60 hover:border-ring/40 hover:bg-muted/60 transition-all"
      >
        <Search className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-sm text-muted-foreground truncate">Search…</span>
        <kbd className="ml-auto font-mono bg-background text-muted-foreground px-1.5 py-0.5 rounded-md border border-border text-[10px] hidden sm:block">
          ⌘K
        </kbd>
      </button>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Presence indicator */}
        <ErrorBoundary fallback={<span />}>
          <PresenceIndicator userId={user?.id} />
        </ErrorBoundary>

        {/* Theme toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleTheme}
              className="size-8 grid place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/60 transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          </TooltipContent>
        </Tooltip>

        {/* Language toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleLang}
              className="h-8 px-2.5 flex items-center gap-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/60 transition-all"
              aria-label="Toggle language"
            >
              <Languages className="size-3.5 shrink-0" />
              <span className="text-[11px] font-bold font-mono uppercase">{lang}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {lang === "en" ? "Switch to Arabic (RTL)" : "Switch to English (LTR)"}
          </TooltipContent>
        </Tooltip>

        <NotificationCenter />

        {/* New button */}
        <Link
          to="/tools"
          className="hidden md:inline-flex text-xs font-medium text-muted-foreground hover:text-foreground border border-border/60 rounded-xl px-3 py-1.5 hover:bg-muted/60 transition-all"
        >
          Library
        </Link>
        <Link
          to="/tools"
          className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="size-3.5" />
          <span className="hidden sm:inline">New</span>
        </Link>
      </div>
    </header>
  );
}
