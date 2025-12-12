import NotificationsSaveCard from "@/components/notifications-save-card";
import { useAllUsersData } from "@/hooks/api/use-all-users-data";
import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { msToTime } from "@/lib/utils/frontend-converters";
import { useDeleteRunner } from "@/providers/notifications/hooks/api/use-delete-runner";
import { useSettingsForToken } from "@/providers/notifications/hooks/api/use-settings-for-token";
import { useUpdateRunner } from "@/providers/notifications/hooks/api/use-update-runner";
import { Ionicons } from "@expo/vector-icons";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo } from "react";
import { Alert, Platform, Pressable, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import { z } from "zod";

// Default values in milliseconds
const DEFAULT_VALUES = {
  second_structure: 4294967295,
  first_portal: 4294967295,
  enter_stronghold: 4294967295,
  enter_end: 4294967295,
  credits: 4294967295,
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

// Format time display - show "All" for 4294967295, "Off" for 0
const formatTimeDisplay = (ms: number): string => {
  if (ms === 4294967295) {
    return "All";
  }
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
    defaultValue: DEFAULT_VALUES.second_structure,
    minMs: 180000, // 3:00
    maxMs: 330000, // 5:30
  },
  {
    key: "v1_16_1_first_portal",
    label: "Nether Exit",
    defaultValue: DEFAULT_VALUES.first_portal,
    minMs: 240000, // 4:00
    maxMs: 420000, // 7:00
  },
  {
    key: "v1_16_1_enter_stronghold",
    label: "Stronghold Enter",
    defaultValue: DEFAULT_VALUES.enter_stronghold,
    minMs: 360000, // 6:00
    maxMs: 540000, // 9:00
  },
  {
    key: "v1_16_1_enter_end",
    label: "End Enter",
    defaultValue: DEFAULT_VALUES.enter_end,
    minMs: 360000, // 6:00
    maxMs: 600000, // 10:00
  },
  {
    key: "v1_16_1_credits",
    label: "Completion",
    defaultValue: DEFAULT_VALUES.credits,
    minMs: 480000, // 8:00
    maxMs: 780000, // 13:00
  },
];

// Zod schema for form validation
// Allow 4294967295 (All), 0 (Off), or values within the specified ranges
const ALL_OPTION_VALUE = 4294967295;
const OFF_OPTION_VALUE = 0;
const notificationFormSchema = z.object({
  v1_16_1_enabled: z.number().min(0).max(1),
  v1_16_1_second_structure: z.union([
    z.literal(ALL_OPTION_VALUE),
    z.literal(OFF_OPTION_VALUE),
    z.number().min(180000).max(330000),
  ]),
  v1_16_1_first_portal: z.union([
    z.literal(ALL_OPTION_VALUE),
    z.literal(OFF_OPTION_VALUE),
    z.number().min(240000).max(420000),
  ]),
  v1_16_1_enter_stronghold: z.union([
    z.literal(ALL_OPTION_VALUE),
    z.literal(OFF_OPTION_VALUE),
    z.number().min(360000).max(540000),
  ]),
  v1_16_1_enter_end: z.union([
    z.literal(ALL_OPTION_VALUE),
    z.literal(OFF_OPTION_VALUE),
    z.number().min(360000).max(600000),
  ]),
  v1_16_1_credits: z.union([
    z.literal(ALL_OPTION_VALUE),
    z.literal(OFF_OPTION_VALUE),
    z.number().min(480000).max(780000),
  ]),
});

type NotificationFormData = z.infer<typeof notificationFormSchema>;

const RunnerSettingsPage = () => {
  const { id: runnerId } = useLocalSearchParams<{ id: string }>();
  const { tintColor } = useColorsForUI();
  const { data: tokenSettings } = useSettingsForToken();
  const { data: users } = useAllUsersData();
  const router = useRouter();
  const { updateRunnerSettingsMutation } = useUpdateRunner();
  const { deleteTokenForRunnerMutation } = useDeleteRunner();

  // Find runner settings
  const runnerSettings = useMemo(() => {
    if (!tokenSettings || !runnerId) return null;
    return tokenSettings.runners?.find((r) => r.id === runnerId);
  }, [tokenSettings, runnerId]);

  // Find runner user data
  const runnerUser = useMemo(() => {
    if (!users || !runnerId) return null;
    return users.find((u) => u.id === runnerId);
  }, [users, runnerId]);

  // Get default values from runner settings or global settings
  const getDefaultValues = (): NotificationFormData => {
    if (runnerSettings?.v1_16_1) {
      return {
        v1_16_1_enabled: runnerSettings.v1_16_1.enabled ?? 0,
        v1_16_1_second_structure: runnerSettings.v1_16_1.second_structure ?? DEFAULT_VALUES.second_structure,
        v1_16_1_first_portal: runnerSettings.v1_16_1.first_portal ?? DEFAULT_VALUES.first_portal,
        v1_16_1_enter_stronghold: runnerSettings.v1_16_1.enter_stronghold ?? DEFAULT_VALUES.enter_stronghold,
        v1_16_1_enter_end: runnerSettings.v1_16_1.enter_end ?? DEFAULT_VALUES.enter_end,
        v1_16_1_credits: runnerSettings.v1_16_1.credits ?? DEFAULT_VALUES.credits,
      };
    }

    // Fallback to global settings
    const settings1_16_1 = tokenSettings?.["v1_16_1"];
    return {
      v1_16_1_enabled: settings1_16_1?.enabled ?? 0,
      v1_16_1_second_structure: settings1_16_1?.second_structure ?? DEFAULT_VALUES.second_structure,
      v1_16_1_first_portal: settings1_16_1?.first_portal ?? DEFAULT_VALUES.first_portal,
      v1_16_1_enter_stronghold: settings1_16_1?.enter_stronghold ?? DEFAULT_VALUES.enter_stronghold,
      v1_16_1_enter_end: settings1_16_1?.enter_end ?? DEFAULT_VALUES.enter_end,
      v1_16_1_credits: settings1_16_1?.credits ?? DEFAULT_VALUES.credits,
    };
  };

  // Initialize form with initial default values
  const form = useForm({
    defaultValues: getDefaultValues(),
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: notificationFormSchema,
      onSubmitAsync: async ({ value }) => {
        if (!runnerId) return;
        await updateRunnerSettingsMutation.mutateAsync({
          runnerId,
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
  const currentDefaults = useMemo(() => getDefaultValues(), [tokenSettings, runnerId]);

  // Update form values when tokenSettings changes (after revalidation)
  // This happens after successful submission, so we reset the form to match server state
  useEffect(() => {
    if (tokenSettings && runnerId) {
      const newDefaults = getDefaultValues();
      // Reset form values to match new server state
      form.reset(newDefaults);
    }
  }, [tokenSettings, runnerId, form]);

  // Show loading or error states
  if (!runnerId) {
    return (
      <>
        <Stack.Screen
          options={{
            headerTitle: "Runner Settings",
          }}
        />
        <View className="flex flex-1 items-center justify-center bg-[#F2F2F2] dark:bg-[#111827]">
          <Text className="text-lg text-black dark:text-[#ECEDEE]">Invalid runner ID</Text>
        </View>
      </>
    );
  }

  if (!runnerSettings) {
    return (
      <>
        <Stack.Screen
          options={{
            headerTitle: `${runnerUser?.nick || "Runner"}'s Notifications`,
          }}
        />
        <View className="flex flex-1 items-center justify-center bg-[#F2F2F2] dark:bg-[#111827]">
          <Text className="text-lg text-black dark:text-[#ECEDEE]">Runner not found</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: `${runnerUser?.nick || "Runner"}'s Notifications`,
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
        <ScrollView contentInsetAdjustmentBehavior="automatic" className="px-4" contentContainerClassName="gap-4">
          {/* PACE NOTIFICATIONS */}
          <View>
            <Text className="py-3 text-2xl font-bold text-black dark:text-[#ECEDEE]">Speedrunner Notifications</Text>
            <Text className="text-md text-black dark:text-[#ECEDEE]">
              Configure notifications for {runnerUser?.nick || "this runner"}&apos;s speedrun pace alerts.
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
                            const allOptions = [...options, ALL_OPTION_VALUE, OFF_OPTION_VALUE];

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
            className="gap-4 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]"
            onPress={() => {
              // Show a native alert to confirm removal
              Alert.alert(
                `Remove ${runnerUser?.nick ?? "Runner"}`,
                `Are you sure you want to opt out of receiving notifications for ${runnerUser?.nick ?? "this runner"}'s speedruns?`,

                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => {
                      deleteTokenForRunnerMutation.mutate({ runnerId });
                      router.back();
                    },
                  },
                ]
              );
            }}
          >
            <Text className="text-xl font-semibold text-black dark:text-[#ECEDEE]">{`Remove ${runnerUser?.nick ?? "Runner"}`}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
};

export default RunnerSettingsPage;
