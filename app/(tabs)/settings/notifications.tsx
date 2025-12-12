import NotificationsSaveCard from "@/components/notifications-save-card";
import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { msToTime } from "@/lib/utils/frontend-converters";
import { useSettingsForToken } from "@/providers/notifications/hooks/api/use-settings-for-token";
import { useUpdateToken } from "@/providers/notifications/hooks/api/use-update-token";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo } from "react";
import { Alert, Platform, Pressable, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import { z } from "zod";

// Default values in milliseconds
const DEFAULT_VALUES = {
  v1_16_1_second_structure: 300000, // 5:00
  v1_16_1_first_portal: 390000, // 6:30
  v1_16_1_enter_stronghold: 480000, // 8:00
  v1_16_1_enter_end: 540000, // 9:00
  v1_16_1_credits: 600000, // 10:00
};

const generateDropdownOptions = (minMs: number, maxMs: number): number[] => {
  const options: number[] = [];
  const increment = 30000; // 30 seconds
  for (let value = minMs; value <= maxMs; value += increment) {
    options.push(value);
  }
  return options;
};

// Format time display - show "Off" for 0
const formatTimeDisplay = (ms: number): string => {
  if (ms === 0) {
    return "Off";
  }
  return `Sub ${msToTime(ms)}`;
};

interface NotificationSetting {
  key:
    | "v1_16_1_second_structure"
    | "v1_16_1_first_portal"
    | "v1_16_1_enter_stronghold"
    | "v1_16_1_enter_end"
    | "v1_16_1_credits";
  label: string;
  defaultValue: number;
  minMs: number;
  maxMs: number;
}

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    key: "v1_16_1_second_structure",
    label: "Second Structure",
    defaultValue: DEFAULT_VALUES.v1_16_1_second_structure,
    minMs: 180000, // 3:00
    maxMs: 330000, // 5:30
  },
  {
    key: "v1_16_1_first_portal",
    label: "Nether Exit",
    defaultValue: DEFAULT_VALUES.v1_16_1_first_portal,
    minMs: 240000, // 4:00
    maxMs: 420000, // 7:00
  },
  {
    key: "v1_16_1_enter_stronghold",
    label: "Stronghold Enter",
    defaultValue: DEFAULT_VALUES.v1_16_1_enter_stronghold,
    minMs: 360000, // 6:00
    maxMs: 540000, // 9:00
  },
  {
    key: "v1_16_1_enter_end",
    label: "End Enter",
    defaultValue: DEFAULT_VALUES.v1_16_1_enter_end,
    minMs: 360000, // 6:00
    maxMs: 600000, // 10:00
  },
  {
    key: "v1_16_1_credits",
    label: "Completion",
    defaultValue: DEFAULT_VALUES.v1_16_1_credits,
    minMs: 480000, // 8:00
    maxMs: 780000, // 13:00
  },
];

// Zod schema for form validation
// Allow 0 (Off) or values within the specified ranges
const OFF_OPTION_VALUE = 0;
const notificationFormSchema = z.object({
  v1_16_1_enabled: z.number().min(0).max(1),
  v1_16_1_second_structure: z.union([z.literal(OFF_OPTION_VALUE), z.number().min(180000).max(330000)]),
  v1_16_1_first_portal: z.union([z.literal(OFF_OPTION_VALUE), z.number().min(240000).max(420000)]),
  v1_16_1_enter_stronghold: z.union([z.literal(OFF_OPTION_VALUE), z.number().min(360000).max(540000)]),
  v1_16_1_enter_end: z.union([z.literal(OFF_OPTION_VALUE), z.number().min(360000).max(600000)]),
  v1_16_1_credits: z.union([z.literal(OFF_OPTION_VALUE), z.number().min(480000).max(780000)]),
});

type NotificationFormData = z.infer<typeof notificationFormSchema>;

const NotificationsPage = () => {
  const { updateTokenMutation } = useUpdateToken();
  const { data: tokenSettings } = useSettingsForToken();
  const router = useRouter();
  const { tintColor } = useColorsForUI();
  // Derived values from token settings
  const settings1_16_1 = tokenSettings?.["v1_16_1"];

  // Get default values from token settings
  const getDefaultValues = (): NotificationFormData => {
    return {
      v1_16_1_enabled: settings1_16_1?.enabled ?? 0,
      v1_16_1_second_structure: settings1_16_1?.second_structure ?? DEFAULT_VALUES.v1_16_1_second_structure,
      v1_16_1_first_portal: settings1_16_1?.first_portal ?? DEFAULT_VALUES.v1_16_1_first_portal,
      v1_16_1_enter_stronghold: settings1_16_1?.enter_stronghold ?? DEFAULT_VALUES.v1_16_1_enter_stronghold,
      v1_16_1_enter_end: settings1_16_1?.enter_end ?? DEFAULT_VALUES.v1_16_1_enter_end,
      v1_16_1_credits: settings1_16_1?.credits ?? DEFAULT_VALUES.v1_16_1_credits,
    };
  };

  // Get hardcoded default values (for reset functionality)
  const getHardcodedDefaults = (): NotificationFormData => {
    return {
      v1_16_1_enabled: 1,
      v1_16_1_second_structure: DEFAULT_VALUES.v1_16_1_second_structure,
      v1_16_1_first_portal: DEFAULT_VALUES.v1_16_1_first_portal,
      v1_16_1_enter_stronghold: DEFAULT_VALUES.v1_16_1_enter_stronghold,
      v1_16_1_enter_end: DEFAULT_VALUES.v1_16_1_enter_end,
      v1_16_1_credits: DEFAULT_VALUES.v1_16_1_credits,
    };
  };

  // Initialize form with initial default values
  const form = useForm({
    defaultValues: getDefaultValues(),
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: notificationFormSchema,
      onSubmitAsync: async ({ value }) => {
        await updateTokenMutation.mutateAsync({
          v1_16_1_enabled: value.v1_16_1_enabled,
          v1_16_1_second_structure: value.v1_16_1_second_structure,
          v1_16_1_first_portal: value.v1_16_1_first_portal,
          v1_16_1_enter_stronghold: value.v1_16_1_enter_stronghold,
          v1_16_1_enter_end: value.v1_16_1_enter_end,
          v1_16_1_credits: value.v1_16_1_credits,
        });
      },
    },
  });

  // Memoize current default values for comparison (updates when tokenSettings changes)
  const currentDefaults = useMemo(() => getDefaultValues(), [tokenSettings]);

  // Update form values when tokenSettings changes (after revalidation)
  // This happens after successful submission, so we reset the form to match server state
  useEffect(() => {
    if (tokenSettings) {
      const newDefaults = getDefaultValues();
      // Reset form values to match new server state
      form.reset(newDefaults);
    }
  }, [tokenSettings, form]);

  // Get enabled runners with their user data

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: undefined,
        }}
      />
      <View className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]">
        <form.Subscribe
          selector={(state) => {
            const currentValues = state.values;
            const isChanged = JSON.stringify(currentValues) !== JSON.stringify(currentDefaults);
            return [isChanged, state.isSubmitting];
          }}
        >
          {([isChanged, isSubmitting]) => (
            <NotificationsSaveCard
              message="Save Changes?"
              actionButtons={[
                {
                  label: "Cancel",
                  onPress: () => {
                    form.reset(currentDefaults);
                  },
                  variant: "secondary",
                },
                {
                  label: "Save",
                  onPress: async () => {
                    await form.handleSubmit();
                  },
                  variant: "primary",
                  loading: isSubmitting,
                },
              ]}
              visible={isChanged}
            />
          )}
        </form.Subscribe>
        <ScrollView contentInsetAdjustmentBehavior="automatic" className="px-4" contentContainerClassName="gap-4 pb-4">
          {/* PACE NOTIFICATIONS */}
          <View>
            <Text className="py-3 text-2xl font-bold text-black dark:text-[#ECEDEE]">Pace Notifications</Text>
            <Text className="text-md text-black dark:text-[#ECEDEE]">
              Configure preferences to receive notifications for speedruns happening live.
            </Text>
          </View>
          <View>
            <View className="gap-4 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]">
              <form.Field name="v1_16_1_enabled">
                {(field) => {
                  const isEnabled = field.state.value === 1;
                  return (
                    <>
                      <View className="flex flex-row items-center">
                        <Text className="flex flex-1 text-2xl font-semibold text-black dark:text-[#ECEDEE]">
                          1.16.1
                        </Text>
                        <Switch
                          {...Platform.select({
                            android: {
                              thumbColor: "#FFFFFF",
                              trackColor: { true: "#00FF00", false: "#AAAAAA" },
                            },
                          })}
                          value={isEnabled}
                          onValueChange={(value) => field.handleChange(value ? 1 : 0)}
                        />
                      </View>
                      {isEnabled && (
                        <View className="gap-2">
                          {NOTIFICATION_SETTINGS.map((setting) => {
                            const options = generateDropdownOptions(setting.minMs, setting.maxMs);
                            const allOptions = [...options, OFF_OPTION_VALUE];

                            return (
                              <form.Field key={setting.key} name={setting.key as keyof NotificationFormData}>
                                {(timingField) => {
                                  const currentValue = timingField.state.value;
                                  return (
                                    <View>
                                      <View className="flex flex-row items-center justify-between">
                                        <Text className="text-lg font-semibold text-black dark:text-[#ECEDEE]">
                                          {setting.label}
                                        </Text>
                                        <DropdownMenu.Root>
                                          <DropdownMenu.Trigger>
                                            <TouchableOpacity className="flex flex-row items-center gap-1">
                                              <Text className="text-xl font-semibold text-black dark:text-[#ECEDEE]">
                                                {formatTimeDisplay(currentValue)}
                                              </Text>
                                              {Platform.OS === "ios" && (
                                                <SymbolView
                                                  name="chevron.up.chevron.down"
                                                  tintColor={tintColor}
                                                  size={16}
                                                />
                                              )}
                                              {Platform.OS === "android" && (
                                                <Ionicons name="chevron-expand-outline" color={tintColor} size={16} />
                                              )}
                                            </TouchableOpacity>
                                          </DropdownMenu.Trigger>
                                          <DropdownMenu.Content>
                                            {allOptions.map((value) => (
                                              <DropdownMenu.Item
                                                key={String(value)}
                                                onSelect={() => timingField.handleChange(value)}
                                              >
                                                <DropdownMenu.ItemTitle>
                                                  {formatTimeDisplay(value)}
                                                </DropdownMenu.ItemTitle>
                                                {currentValue === value && <DropdownMenu.ItemIndicator />}
                                              </DropdownMenu.Item>
                                            ))}
                                          </DropdownMenu.Content>
                                        </DropdownMenu.Root>
                                      </View>
                                    </View>
                                  );
                                }}
                              </form.Field>
                            );
                          })}
                        </View>
                      )}
                    </>
                  );
                }}
              </form.Field>
            </View>
          </View>
          <Pressable
            onPress={() => {
              // Show a native alert to confirm reset
              Alert.alert(
                "Reset to Default",
                "Are you sure you want to reset all pace notification settings to their default values?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Reset",
                    style: "destructive",
                    onPress: async () => {
                      const hardcodedDefaults = getHardcodedDefaults();
                      form.reset(hardcodedDefaults);
                      await form.handleSubmit();
                    },
                  },
                ]
              );
            }}
          >
            <View className="gap-4 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]">
              <Text className="text-xl font-semibold text-black dark:text-[#ECEDEE]">Reset to Default</Text>
            </View>
          </Pressable>

          {/* RUNNER NOTIFICATIONS LINK */}
          <Text className="text-2xl font-bold text-black dark:text-[#ECEDEE]">Speedrunner Notifications</Text>
          <Text className="text-md text-black dark:text-[#ECEDEE]">
            Configure preferences to receive notifications for a specific speedrunner, including their offline
            speedruns.
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)/settings/runners")}
            className="flex flex-row gap-4 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]"
          >
            <Text className="flex flex-1 text-xl font-semibold text-black dark:text-[#ECEDEE]">
              Manage Speedrunners
            </Text>
            {Platform.OS === "ios" && <SymbolView name="chevron.right" size={18} />}
            {Platform.OS === "android" && <MaterialCommunityIcons name="chevron-right" size={24} color={tintColor} />}
          </Pressable>
          <View>
            <Text className="py-3 text-2xl font-bold text-black dark:text-[#ECEDEE]">About</Text>
            <View className="gap-4 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]">
              <Text className="text-md text-black dark:text-[#ECEDEE]">
                Notifications are available for version 1.16.1 of the game.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default NotificationsPage;
