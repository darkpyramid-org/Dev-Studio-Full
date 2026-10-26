import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, Info, Sparkles, Trash2, X } from "lucide-react";
import { CalendarCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";
import type { AppNotification } from "@/data/notifications";

function NotifIcon({ icon }: { icon: AppNotification["icon"] }) {
  if (icon === "sparkles") return <Sparkles className="size-3.5 text-primary" />;
  if (icon === "calendar") return <CalendarCheck className="size-3.5 text-emerald-500" />;
  return <Info className="size-3.5 text-muted-foreground" />;
}

/**
 * Header bell button + notification dropdown.
 * Owns its own open state and outside-click dismissal.
 */
export function NotificationCenter() {
  const { notifications, unreadCount, markAllRead, clearAll, dismissOne, readOne } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Tooltip open={open ? false : undefined}>
        <TooltipTrigger asChild>
          <button
            onClick={() => {
              setOpen((o) => !o);
              if (!open) markAllRead();
            }}
            className="relative size-8 grid place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/60 transition-all"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 size-4 flex items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground leading-none">
                {unreadCount}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          Notifications
        </TooltipContent>
      </Tooltip>

      {/* Notification dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[min(320px,calc(100vw-1rem))] rounded-2xl border border-border/60 bg-background/95 backdrop-blur-sm shadow-lg z-[9999] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Bell className="size-3.5 text-primary" />
              <span className="text-sm font-semibold">Notifications</span>
              {notifications.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  {notifications.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1 rounded-lg hover:bg-muted/60"
                    title="Mark all read"
                  >
                    <CheckCheck className="size-3" /> All read
                  </button>
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-destructive transition-colors px-1.5 py-1 rounded-lg hover:bg-muted/60"
                    title="Clear all"
                  >
                    <Trash2 className="size-3" /> Clear
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-72 overflow-y-auto scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                <Bell className="size-8 opacity-20" />
                <p className="text-xs font-medium">All caught up!</p>
                <p className="text-[10px] opacity-60">No new notifications</p>
              </div>
            ) : (
              <ul className="p-2 space-y-1">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => readOne(n.id)}
                      onKeyDown={(e) => e.key === "Enter" && readOne(n.id)}
                      className={cn(
                        "w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all group cursor-pointer",
                        n.read
                          ? "opacity-60 hover:opacity-100 hover:bg-muted/40"
                          : "bg-primary/5 hover:bg-primary/10 ring-1 ring-primary/10",
                      )}
                    >
                      <div
                        className={cn(
                          "size-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                          n.read ? "bg-muted/60" : "bg-primary/10",
                        )}
                      >
                        <NotifIcon icon={n.icon} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold leading-tight truncate">
                            {n.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissOne(n.id);
                            }}
                            className="size-4 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all shrink-0"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
                          {n.body}
                        </p>
                        <p className="text-[10px] text-muted-foreground/50 mt-1">{n.time}</p>
                      </div>
                      {!n.read && <div className="size-1.5 rounded-full bg-primary shrink-0 mt-2" />}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
