import { useScreenOptions } from "@/hooks/use-screen-options";
import { isDeviceEligibleForNotifications } from "@/lib/utils/frontend-converters";
import { Stack } from "expo-router";

export default function SettingsDetailsLayout() {
  const screenOptions = useScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Protected guard={isDeviceEligibleForNotifications}>
        <Stack.Screen
          name="notifications"
          options={{
            headerTitle: "Notifications Settings",
          }}
        />
        <Stack.Screen
          name="runners"
          options={{
            headerTitle: "Manage Speedrunners",
          }}
        />
        <Stack.Screen
          name="notifications/runners/[id]"
          options={{
            headerTitle: "Runners Settings",
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
