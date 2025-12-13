import RegisterTokenToast from "@/components/register-token-toast";
import { prepareAndroidIntegrityTokenProvider } from "@/providers/notifications/helpers/android-integrity-provider";
import { useRegisterToken } from "@/providers/notifications/hooks/api/use-register-token";
import { registerForPushNotifications } from "@/providers/notifications/register-for-push-notifications";
import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { usePathname } from "expo-router";
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { handleNotificationWhenBackgroundedAndTapped } from "./helpers/handle-notification-when-backgrounded-and-tapped";
import { handleNotificationWhenForegrounded } from "./helpers/handle-notification-when-foregrounded";

interface NotificationContextType {
  expoToken: string | null;
  deviceToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
  permission: `${Notifications.PermissionStatus}` | null;
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
  const [expoToken, setExpoToken] = useState<string | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<`${Notifications.PermissionStatus}` | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { registerTokenMutation } = useRegisterToken();

  const queryClient = useQueryClient();
  const responseListener = useRef<Notifications.EventSubscription>(null);
  const notificationListener = useRef<Notifications.EventSubscription>(null);

  const currentPath = usePathname();
  const currentPathRef = useRef(currentPath);

  useEffect(() => {
    currentPathRef.current = currentPath;
  }, [currentPath]);

  const tappedNotification = Notifications.useLastNotificationResponse();

  useEffect(() => {
    prepareAndroidIntegrityTokenProvider();

    Notifications.getPermissionsAsync().then(({ status }) => {
      setPermission(status);
    });

    registerForPushNotifications(registerTokenMutation, queryClient).then(
      ({ expoToken, deviceToken }) => {
        setExpoToken(expoToken);
        setDeviceToken(deviceToken);
      },
      (error) => {
        setError(error);
        if (error.message === "Permission not granted to get push token for push notification!") {
          setPermission("denied");
        }
      }
    );

    // HANDLE NOTIFICATIONS WHEN INSIDE APP
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      handleNotificationWhenForegrounded(notification, currentPathRef.current);
      setNotification(notification);
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

  // HANDLE NOTIFICATIONS WHEN OUTSIDE APP, AND NOTIFICATION CLICKED ON
  useEffect(() => {
    handleNotificationWhenBackgroundedAndTapped(tappedNotification);
  }, [tappedNotification]);

  return (
    <NotificationContext.Provider value={{ expoToken, deviceToken, notification, error, permission }}>
      {children}
      <RegisterTokenToast
        isPending={registerTokenMutation.isPending}
        isSuccess={registerTokenMutation.isSuccess}
        isError={registerTokenMutation.isError}
      />
    </NotificationContext.Provider>
  );
};
