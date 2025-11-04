import PlayerCard from "@/components/player-card";
import { useAllUsersData } from "@/hooks/api/use-all-users-data";
import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { msToTime } from "@/lib/utils/frontend-converters";
import { useNotification } from "@/providers/notifications";
import { useUpdateToken } from "@/providers/notifications/hooks/api/use-push-tokens";
import { useSettingsForToken } from "@/providers/notifications/hooks/api/use-token-for-runner";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { Platform, Pressable, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";

// Default values in milliseconds
const DEFAULT_VALUES = {
  second_structure: 300000, // 5:00
  first_portal: 390000, // 6:30
  enter_stronghold: 480000, // 8:00
  enter_end: 540000, // 9:00
  credits: 600000, // 10:00
};

// Generate dropdown options from min to max with 30s increments
const generateDropdownOptions = (minMs: number, maxMs: number): number[] => {
  const options: number[] = [];
  const increment = 30000; // 30 seconds
  for (let value = minMs; value <= maxMs; value += increment) {
    options.push(value);
  }
  return options;
};

interface NotificationSetting {
  key:
    | "1_16_1_second_structure"
    | "1_16_1_first_portal"
    | "1_16_1_enter_stronghold"
    | "1_16_1_enter_end"
    | "1_16_1_credits";
  label: string;
  defaultValue: number;
  minMs: number;
  maxMs: number;
}

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    key: "1_16_1_second_structure",
    label: "Second Structure",
    defaultValue: DEFAULT_VALUES.second_structure,
    minMs: 180000, // 3:00
    maxMs: 330000, // 5:30
  },
  {
    key: "1_16_1_first_portal",
    label: "Nether Exit",
    defaultValue: DEFAULT_VALUES.first_portal,
    minMs: 240000, // 4:00
    maxMs: 420000, // 7:00
  },
  {
    key: "1_16_1_enter_stronghold",
    label: "Stronghold Enter",
    defaultValue: DEFAULT_VALUES.enter_stronghold,
    minMs: 360000, // 6:00
    maxMs: 540000, // 9:00
  },
  {
    key: "1_16_1_enter_end",
    label: "End Enter",
    defaultValue: DEFAULT_VALUES.enter_end,
    minMs: 360000, // 6:00
    maxMs: 600000, // 10:00
  },
  {
    key: "1_16_1_credits",
    label: "Completion",
    defaultValue: DEFAULT_VALUES.credits,
    minMs: 480000, // 8:00
    maxMs: 780000, // 13:00
  },
];

// Map API key to backend response property name
const KEY_TO_PROPERTY_MAP: Record<
  NotificationSetting["key"],
  "second_structure" | "first_portal" | "enter_stronghold" | "enter_end" | "credits"
> = {
  "1_16_1_second_structure": "second_structure",
  "1_16_1_first_portal": "first_portal",
  "1_16_1_enter_stronghold": "enter_stronghold",
  "1_16_1_enter_end": "enter_end",
  "1_16_1_credits": "credits",
};

const NotificationsPage = () => {
  const { expoPushToken } = useNotification();
  const { updateTokenMutation, debouncedUpdateTokenMutation } = useUpdateToken(expoPushToken);
  const { data: tokenSettings } = useSettingsForToken();
  const { data: users } = useAllUsersData();
  const router = useRouter();
  const { tintColor } = useColorsForUI();

  // Derived values from token settings
  const settings1_16_1 = tokenSettings?.["1_16_1"];
  const isEnabled = settings1_16_1?.enabled === 1;

  // Get enabled runners with their user data
  const enabledRunners = useMemo(() => {
    const runnerIds = tokenSettings?.runners || [];
    if (!users || runnerIds.length === 0) return [];

    return runnerIds
      .map((runnerId) => {
        const user = users.find((u) => u.id === runnerId);
        return user ? { uuid: runnerId, nickname: user.nick } : null;
      })
      .filter((runner): runner is { uuid: string; nickname: string } => runner !== null);
  }, [tokenSettings?.runners, users]);

  // Get current value for each setting, fallback to default if not set
  const getCurrentValue = (key: NotificationSetting["key"]): number => {
    const setting = NOTIFICATION_SETTINGS.find((s) => s.key === key);
    if (!setting) return 0;

    const propertyName = KEY_TO_PROPERTY_MAP[key];
    const value = settings1_16_1?.[propertyName] as number | undefined;
    return value ?? setting.defaultValue;
  };

  // Handle switch change
  const handleSwitchChange = (value: boolean) => {
    updateTokenMutation.mutate({
      "1_16_1_enabled": value ? 1 : 0,
    });
  };

  // Handle dropdown change
  const handleDropdownChange = (key: NotificationSetting["key"], value: number) => {
    debouncedUpdateTokenMutation({ [key]: value });
  };

  return (
    <View className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]">
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="px-4" contentContainerClassName="gap-4">
        {/* PACE NOTIFICATIONS */}
        <View>
          <Text className="py-3 text-2xl font-bold text-black dark:text-[#ECEDEE]">Enable Pace Notifications</Text>
          <View className="gap-4 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]">
            <View className="flex flex-row items-center">
              <Text className="flex flex-1 text-2xl font-semibold text-black dark:text-[#ECEDEE]">1.16.1</Text>
              <Switch value={isEnabled} onValueChange={handleSwitchChange} />
            </View>
            {isEnabled && (
              <View className="gap-2">
                {NOTIFICATION_SETTINGS.map((setting) => {
                  const currentValue = getCurrentValue(setting.key);
                  const options = generateDropdownOptions(setting.minMs, setting.maxMs);

                  return (
                    <View key={setting.key}>
                      <View className="flex flex-row items-center justify-between">
                        <Text className="text-lg font-semibold text-black dark:text-[#ECEDEE]">{setting.label}</Text>
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <TouchableOpacity className="flex flex-row items-center gap-1">
                              <Text className="text-xl font-semibold text-black dark:text-[#ECEDEE]">
                                {`Sub ${msToTime(currentValue)}`}
                              </Text>
                              <SymbolView name="chevron.up.chevron.down" tintColor={tintColor} size={16} />
                            </TouchableOpacity>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            {options.map((value) => (
                              <DropdownMenu.Item
                                key={String(value)}
                                onSelect={() => handleDropdownChange(setting.key, value)}
                              >
                                <DropdownMenu.ItemTitle>{`Sub ${msToTime(value)}`}</DropdownMenu.ItemTitle>
                                {currentValue === value && <DropdownMenu.ItemIndicator />}
                              </DropdownMenu.Item>
                            ))}
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* RUNNER NOTIFICATIONS LINK */}
        <Text className="py-3 text-2xl font-bold text-black dark:text-[#ECEDEE]">Enable Runner Notifications</Text>

        <Pressable
          onPress={() => router.push("/(tabs)/settings/runners")}
          className="flex flex-row gap-4 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]"
        >
          <Text className="flex flex-1 text-xl font-semibold text-black dark:text-[#ECEDEE]">Add Speedrunners</Text>
          {Platform.OS === "ios" && <SymbolView name="chevron.right" size={18} />}
          {Platform.OS === "android" && <MaterialCommunityIcons name="chevron-right" size={24} color={tintColor} />}
        </Pressable>

        {/* ENABLED RUNNERS */}
        {enabledRunners.length > 0 && (
          <View className="gap-2 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]">
            {enabledRunners.map((runner) => (
              <PlayerCard key={runner.uuid} type="search" uuid={runner.uuid} nickname={runner.nickname} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationsPage;
