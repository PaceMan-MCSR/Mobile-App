import { registerForPushNotifications } from "@/providers/notifications/helpers/register-for-push-notifications";
import { useRegisterToken } from "@/providers/notifications/hooks/api/use-push-tokens";
import * as Notifications from "expo-notifications";
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationsProvider");
  }
  return context;
};

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { registerTokenMutation } = useRegisterToken();

  const notificationListener = useRef<Notifications.EventSubscription>(null);
  const responseListener = useRef<Notifications.EventSubscription>(null);

  useEffect(() => {
    registerForPushNotifications(registerTokenMutation).then(
      (token) => setExpoPushToken(token),
      (error) => setError(error)
    );

    // HANDLE NOTIFICATIONS WHEN INSIDE APP
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log(`[${Platform.OS}] - Received: ${JSON.stringify(notification)}`);
      setNotification(notification);
    });

    // HANDLE NOTIFICATIONS WHEN OUTSIDE APP, AND NOTIFICATION CLICKED ON
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(
        `[${Platform.OS}] - Response:
        ${JSON.stringify(response, null, 2)},
        ${JSON.stringify(response.notification.request.content.data, null, 2)}`
      );
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification, error }}>
      {children}
    </NotificationContext.Provider>
  );
};
