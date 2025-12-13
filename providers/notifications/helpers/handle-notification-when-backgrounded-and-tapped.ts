/* 
Handles when a user taps on a notification from a foregrounded or killed application.
- Opens the /stats/run/[worldId] page.
- Dismisses other notifications for the same run.
*/
import {
  DEFAULT_ACTION_IDENTIFIER,
  dismissNotificationAsync,
  getPresentedNotificationsAsync,
  MaybeNotificationResponse,
} from "expo-notifications";
import { router } from "expo-router";

export const handleNotificationWhenBackgroundedAndTapped = async (
  tappedNotification: MaybeNotificationResponse | null
) => {
  if (!tappedNotification) return;

  if (
    tappedNotification.notification.request.content.data.worldId &&
    tappedNotification.notification.request.content.data.nickname &&
    tappedNotification.actionIdentifier === DEFAULT_ACTION_IDENTIFIER
  ) {
    const { worldId, nickname } = tappedNotification.notification.request.content.data as {
      worldId: string;
      nickname: string;
    };
    const presentedNotifications = await getPresentedNotificationsAsync();
    for (const notification of presentedNotifications) {
      if (notification.request.content.data.worldId === worldId) {
        await dismissNotificationAsync(notification.request.identifier);
      }
    }
    router.push(`/stats/run/${worldId}?searchQueriedNickname=${nickname}`);
  }
};
