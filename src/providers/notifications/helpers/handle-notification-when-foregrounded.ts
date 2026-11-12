/* 
Handles when a user taps on a notification from a foregrounded or killed application.
- Determines if user is on
  - Home screen (Can see all pace updates anyway)
  - Already on the pace splits screen (won't need more notifications for that run)
- If the above is false, shows a toast for the notification.
*/
import { paceNotificationToast } from "@/components/notifications-toast";
import { Notification } from "expo-notifications";

export const handleNotificationWhenForegrounded = (tappedNotification: Notification, currentPath: string) => {
  if (tappedNotification.request.content.data) {
    const { nickname, split, worldId, twitch } = tappedNotification.request.content.data as {
      nickname: string;
      split: string;
      worldId: string;
      twitch?: string;
    };

    const shouldShowPaceNotificationsToast = currentPath !== "/" && currentPath !== `/stats/run/${worldId}`;

    if (shouldShowPaceNotificationsToast) {
      paceNotificationToast({
        nickname,
        split,
        worldId,
        twitch,
      });
    }
  }
};
