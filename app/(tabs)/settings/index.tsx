import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { isDeviceEligibleForNotifications } from "@/lib/utils/frontend-converters";
import { storage } from "@/lib/utils/mmkv";
import { useNotification } from "@/providers/notifications";
import { useSettingsForToken } from "@/providers/notifications/hooks/api/use-settings-for-token";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, Linking, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv";

const SettingsPage = () => {
  const [theme, setTheme] = useMMKVString("settings-theme", storage);
  const [haptics, setHaptics] = useMMKVBoolean("settings-haptics", storage);

  const { permission } = useNotification();
  const { setColorScheme } = useColorScheme();
  const { tintColor, checkboxColor } = useColorsForUI();
  const { data: tokenSettings, isLoading: isTokenSettingsLoading } = useSettingsForToken();

  const isNotificationsSettingsAvailable = !isTokenSettingsLoading && !!tokenSettings;
  const router = useRouter();

  return (
    <View className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]">
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="px-4" contentContainerClassName="gap-4">
        {/* APPEARANCE SETTINGS */}
        <View>
          <Text className="py-3 text-2xl font-bold text-black dark:text-[#ECEDEE]">Appearance</Text>
          <View className="gap-4 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]">
            <View className="flex flex-row items-center">
              <Text className="flex flex-1 text-xl font-semibold text-black dark:text-[#ECEDEE]">System</Text>
              <Checkbox
                value={theme === "system"}
                onValueChange={() => {
                  setColorScheme("system");
                  setTheme("system");
                }}
                color={checkboxColor}
              />
            </View>
            <View className="flex flex-row items-center">
              <Text className="flex flex-1 text-xl font-semibold text-black dark:text-[#ECEDEE]">Light</Text>
              <Checkbox
                value={theme === "light"}
                onValueChange={() => {
                  setColorScheme("light");
                  setTheme("light");
                }}
                color={checkboxColor}
              />
            </View>
            <View className="flex flex-row items-center">
              <Text className="flex flex-1 text-xl font-semibold text-black dark:text-[#ECEDEE]">Dark</Text>
              <Checkbox
                value={theme === "dark"}
                onValueChange={() => {
                  setColorScheme("dark");
                  setTheme("dark");
                }}
                color={checkboxColor}
              />
            </View>
          </View>
        </View>
        {/* ACCESSIBILITY SETTINGS */}
        <View>
          <Text className="py-3 text-2xl font-bold text-black dark:text-[#ECEDEE]">Accessibility</Text>
          <View className="gap-2 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]">
            <View className="flex flex-row items-center">
              <Text className="flex flex-1 text-xl font-semibold text-black dark:text-[#ECEDEE]">Tab Bar Haptics</Text>
              <Checkbox value={haptics} onValueChange={setHaptics} color={checkboxColor} />
            </View>
          </View>
        </View>
        {/* NOTIFICATIONS SETTINGS */}
        {isDeviceEligibleForNotifications && (
          <View className="gap-3">
            <Text className="text-2xl font-bold text-black dark:text-[#ECEDEE]">Push Notifications</Text>
            {permission === "denied" ? (
              <View className="gap-2 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]">
                <Text className="text-xl font-semibold text-black dark:text-[#ECEDEE]">
                  Notification permissions not granted
                </Text>
                <Text className="text-md text-black/70 dark:text-[#ECEDEE]/70">
                  Enable notification permissions for the PaceMan.gg app in your device settings, if you wish to receive
                  push notifications.
                </Text>
              </View>
            ) : (
              <Pressable
                disabled={!isNotificationsSettingsAvailable}
                onPress={() => router.push("/settings/notifications")}
                className="gap-2 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]"
              >
                <View className="flex flex-row items-center">
                  <Text className="flex flex-1 text-xl font-semibold text-black dark:text-[#ECEDEE]">
                    {isNotificationsSettingsAvailable ? `Notifications Settings ` : `Syncing Notifications Settings`}
                  </Text>
                  {isNotificationsSettingsAvailable ? (
                    <>
                      {Platform.OS === "ios" && <SymbolView name="chevron.right" size={18} />}
                      {Platform.OS === "android" && (
                        <MaterialCommunityIcons name="chevron-right" size={24} color={tintColor} />
                      )}
                    </>
                  ) : (
                    <ActivityIndicator />
                  )}
                </View>
              </Pressable>
            )}
          </View>
        )}
        {/* ABOUT SECTION */}
        <View>
          <Text className="py-3 text-2xl font-bold text-black dark:text-[#ECEDEE]">About</Text>
          <View className="gap-4 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]">
            <Text className="text-md flex flex-1 text-black dark:text-[#ECEDEE]">
              PaceMan.gg is a community-driven application to serve as a real-time speedrun pace tracker. This
              application is not affiliated with or endorsed by Minecraft, Mojang or Microsoft.
            </Text>
            <Text className="text-md flex flex-1 text-black dark:text-[#ECEDEE]">
              In accordance with{" "}
              <Text
                onPress={() => Linking.openURL(`https://www.minecraft.net/en-us/usage-guidelines`)}
                className="underline"
              >
                {"Minecraft's Usage Guidelines"}
              </Text>
              .
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsPage;
