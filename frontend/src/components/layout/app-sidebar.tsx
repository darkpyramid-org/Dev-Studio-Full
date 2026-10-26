import { Link, useRouterState } from "@tanstack/react-router";
import { Flame, Search, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/features/auth/user-menu";
import type { NavEntry } from "@/constants";
import {
  COMMUNICATION_NAV,
  FREELANCE_NAV,
  SKILLS_NAV,
  WORKSPACE_NAV,
} from "@/constants";

/* ── NavItem ────────────────────────────────────────────── */
function NavItem({
  item,
  active,
  isCollapsed,
}: {
  item: NavEntry;
  active: boolean;
  isCollapsed: boolean;
}) {
  const Icon = item.icon;
  const content = (
    <Link
      to={item.to}
      search={item.search}
      className={cn(
        "flex items-center rounded-xl transition-all duration-150",
        isCollapsed ? "justify-center size-9 mx-auto" : "gap-2.5 px-3 py-2",
        active
          ? "bg-primary/10 text-primary ring-1 ring-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
      )}
    >
      <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
      {!isCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
    </Link>
  );
  if (!isCollapsed) return <li>{content}</li>;
  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={12} className="font-medium text-xs">
          {item.label}
        </TooltipContent>
      </Tooltip>
    </li>
  );
}

function SectionLabel({ label, isCollapsed }: { label: string; isCollapsed: boolean }) {
  if (isCollapsed) return <div className="my-1 h-px bg-border/50 mx-2" />;
  return (
    <p className="px-3 mb-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
      {label}
    </p>
  );
}

function NavSection({
  label,
  items,
  pathname,
  isCollapsed,
}: {
  label: string;
  items: readonly NavEntry[];
  pathname: string;
  isCollapsed: boolean;
}) {
  return (
    <div>
      <SectionLabel label={label} isCollapsed={isCollapsed} />
      <ul className="space-y-0.5">
        {items.map((item) => {
          const active = item.match
            ? item.match.some((p) => pathname.startsWith(p))
            : item.to === "/"
              ? pathname === "/"
              : pathname.startsWith(item.to);
          return (
            <NavItem
              key={item.label}
              item={item}
              active={active}
              isCollapsed={isCollapsed}
            />
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Left navigation sidebar: logo, nav sections, quick search and user menu.
 * Collapse state is owned by AppShell (shared with the header toggle).
 */
export function AppSidebar({
  isCollapsed,
  mobileOpen,
  onCloseMobile,
  onOpenPalette,
}: {
  isCollapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenPalette: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div
      className={cn(
        "fixed md:relative inset-y-0 left-0 z-[110] flex shrink-0 flex-col transition-[width,transform] duration-300 ease-in-out p-2",
        mobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
        isCollapsed ? "md:w-[72px]" : "md:w-[228px]",
      )}
    >
      <nav className="flex flex-col flex-1 rounded-2xl bg-sidebar border border-border/60 shadow-sm overflow-hidden">
        {/* Logo */}
        <div
          className={cn(
            "flex items-center shrink-0 px-3 py-3",
            isCollapsed ? "justify-center" : "gap-2.5",
          )}
        >
          <div className="size-7 rounded-xl bg-primary grid place-items-center shrink-0 shadow-sm">
            <Flame className="size-3.5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="font-semibold tracking-tight text-sm truncate">Dev Studio</span>
              <span className="text-[10px] text-muted-foreground font-mono truncate">
                your dev hub
              </span>
            </div>
          )}
          <button
            onClick={onCloseMobile}
            className="ml-auto md:hidden size-7 grid place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Nav sections */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-3 scrollbar-thin">
          <NavSection
            label="Workspace"
            items={WORKSPACE_NAV}
            pathname={pathname}
            isCollapsed={isCollapsed}
          />
          <NavSection
            label="Communication"
            items={COMMUNICATION_NAV}
            pathname={pathname}
            isCollapsed={isCollapsed}
          />
          <NavSection
            label="Skills"
            items={SKILLS_NAV}
            pathname={pathname}
            isCollapsed={isCollapsed}
          />
          <NavSection
            label="Freelance"
            items={FREELANCE_NAV}
            pathname={pathname}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Sidebar footer */}
        <div className="border-t border-border/60 p-2">
          {!isCollapsed ? (
            <button
              onClick={onOpenPalette}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-xl bg-muted/40 hover:bg-muted/80 transition-colors text-muted-foreground mb-2"
            >
              <span className="flex items-center gap-2">
                <Search className="size-3.5" /> Quick search
              </span>
              <kbd className="font-mono bg-background text-muted-foreground px-1.5 py-0.5 rounded-md border border-border text-[10px]">
                ⌘K
              </kbd>
            </button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onOpenPalette}
                  className="w-9 h-9 mx-auto flex items-center justify-center rounded-xl bg-muted/40 hover:bg-muted/80 transition-colors text-muted-foreground mb-2"
                >
                  <Search className="size-4 shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12} className="font-medium text-xs">
                Quick search (⌘K)
              </TooltipContent>
            </Tooltip>
          )}
          <UserMenu isCollapsed={isCollapsed} />
        </div>
      </nav>
    </div>
  );
}
