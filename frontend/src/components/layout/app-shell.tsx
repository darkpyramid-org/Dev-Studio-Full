import { useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommandPalette } from "./command-palette";
import { ErrorBoundary } from "@/components/errors";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { cn } from "@/lib/utils";
import { STORAGE_KEYS } from "@/constants";

const SIDEBAR_KEY = STORAGE_KEYS.SIDEBAR_COLLAPSED;
function readSidebarPref(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_KEY) !== "false";
  } catch {
    return true;
  }
}
function writeSidebarPref(c: boolean) {
  try {
    localStorage.setItem(SIDEBAR_KEY, String(c));
  } catch (err) {
    console.warn("[app-shell] Failed to save sidebar collapse preference:", err);
  }
}

/**
 * Thin orchestrator: composes the sidebar, header and command palette and
 * owns only cross-cutting shell state (palette, mobile sidebar, collapse).
 * Theme, language, notifications and nav rendering live in their own
 * dedicated hooks/components.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(readSidebarPref);

  /* Keyboard shortcut: ⌘K / Ctrl+K toggles the command palette */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Close the mobile sidebar on navigation */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      writeSidebarPref(!prev);
      return !prev;
    });
  };

  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={150}>
      <div className="flex h-screen h-dvh w-full overflow-hidden bg-muted/30">
        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100] md:hidden"
          />
        )}

        <AppSidebar
          isCollapsed={isCollapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onOpenPalette={() => setPaletteOpen(true)}
        />

        {/* ── Main area ──────────────────────────────── */}
        <div className={cn("flex-1 flex flex-col min-w-0 p-2 md:pl-0 gap-2")}>
          <AppHeader
            isCollapsed={isCollapsed}
            onOpenMobile={() => setMobileOpen(true)}
            onToggleCollapsed={toggleCollapsed}
            onOpenPalette={() => setPaletteOpen(true)}
          />

          {/* ── Page content ─────────────────────────── */}
          <main className="flex-1 flex flex-col min-h-0 rounded-2xl bg-background border border-border/60 shadow-sm overflow-hidden">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>

        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      </div>
    </TooltipProvider>
  );
}
