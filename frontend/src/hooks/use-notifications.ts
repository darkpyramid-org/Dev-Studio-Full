import { useState } from "react";
import { INIT_NOTIFICATIONS, type AppNotification } from "@/data/notifications";

export interface UseNotificationsResult {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
  clearAll: () => void;
  dismissOne: (id: string) => void;
  readOne: (id: string) => void;
}

/** Notification list state: read/unread tracking, dismiss and clear. */
export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<AppNotification[]>(INIT_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);
  const dismissOne = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const readOne = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return { notifications, unreadCount, markAllRead, clearAll, dismissOne, readOne };
}
