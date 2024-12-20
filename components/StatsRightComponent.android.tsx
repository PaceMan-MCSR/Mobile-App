import React from "react";
import { View } from "react-native";
import { MenuView } from "@react-native-menu/menu";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

interface StatsRightComponentProps {
  days: number;
  category: string;
  type: "count" | "average" | "fastest" | "conversion";
  onDaysSelect: (days: number) => void;
  onCategorySelect: (category: string) => void;
  onTypeSelect: (type: "count" | "average" | "fastest" | "conversion") => void;
}

const StatsRightComponent: React.FC<StatsRightComponentProps> = ({
  days,
  category,
  type,
  onDaysSelect,
  onCategorySelect,
  onTypeSelect,
}) => {
  const { colorScheme } = useColorScheme();

  const daysOptions = [
    { key: 1, label: "Daily" },
    { key: 7, label: "Weekly" },
    { key: 30, label: "Monthly" },
    { key: 9999, label: "All Time" },
  ];

  const categoryOptions = [
    { key: "nether", label: "Nether Enter" },
    { key: "bastion", label: "Bastion Enter" },
    { key: "fortress", label: "Fortress Enter" },
    { key: "first_structure", label: "Structure 1 Enter" },
    { key: "second_structure", label: "Structure 2 Enter" },
    { key: "first_portal", label: "First Portal" },
    { key: "second_portal", label: "Second Portal" },
    { key: "stronghold", label: "Stronghold Enter" },
    { key: "end", label: "End Enter" },
    { key: "finish", label: "Completion" },
  ];

  const typeOptions = [
    { key: "count", label: "Count" },
    { key: "average", label: "Average" },
    { key: "fastest", label: "Fastest" },
    { key: "conversion", label: "Conversion" },
  ];

  const getTextColor = () => (colorScheme === "dark" ? "#FFFFFF" : "#000000");

  return (
    <View className="flex flex-row-reverse items-center">
      <MenuView
        title="Filter Stats"
        onPressAction={({ nativeEvent }) => {
          const actionId = nativeEvent.event;

          const matchingDays = daysOptions.find((d) => d.key.toString() === actionId);
          const matchingCategory = categoryOptions.find((c) => c.key === actionId);
          const matchingType = typeOptions.find((t) => t.key === actionId);

          if (matchingDays) onDaysSelect(matchingDays.key);
          if (matchingCategory) onCategorySelect(matchingCategory.key);
          if (matchingType) onTypeSelect(matchingType.key as typeof type);
        }}
        actions={[
          {
            id: "type",
            title: "Sort By",
            titleColor: getTextColor(),
            subactions: typeOptions.map((opt) => ({
              id: opt.key,
              title: opt.label,
              titleColor: getTextColor(),
              state: type === opt.key ? "on" : "off",
            })),
          },
          {
            id: "category",
            title: "Category",
            titleColor: getTextColor(),
            subactions: categoryOptions.map((opt) => ({
              id: opt.key,
              title: opt.label,
              titleColor: getTextColor(),
              state: category === opt.key ? "on" : "off",
              attributes: category === opt.key ? { selected: true } : undefined,
            })),
          },
          {
            id: "days",
            title: "Time Period",
            titleColor: getTextColor(),
            subactions: daysOptions.map((opt) => ({
              id: opt.key.toString(),
              title: opt.label,
              titleColor: getTextColor(),
              state: days === opt.key ? "on" : "off",
            })),
          },
        ]}
      >
        <View className="mr-3">
          <Ionicons name="menu-outline" size={28} color={getTextColor()} />
        </View>
      </MenuView>
    </View>
  );
};

export default StatsRightComponent;
