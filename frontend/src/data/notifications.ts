/**
 * Seed notification data.
 *
 * Extracted from AppShell so notification state is not owned by the layout
 * component. When a real notification backend/WS channel lands, this seed
 * is replaced by live data fed into `useNotifications()`.
 */

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: "sparkles" | "calendar" | "info";
}

export const INIT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "Planner updated",
    body: "AI suggestions are now live on your planner.",
    time: "2 min ago",
    read: false,
    icon: "sparkles",
  },
  {
    id: "n2",
    title: "Tasks due today",
    body: "You have 3 high-priority tasks scheduled.",
    time: "1 hr ago",
    read: false,
    icon: "calendar",
  },
  {
    id: "n3",
    title: "Welcome to Dev Studio",
    body: "Your workspace is ready. Start building!",
    time: "Today",
    read: true,
    icon: "info",
  },
];
