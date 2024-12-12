import React, { useRef } from "react";
import { View, Platform } from "react-native";
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
  const menuRef = useRef<MenuView>(null);
  const { colorScheme } = useColorScheme();

  const daysOptions = [
    { key: 1, label: "Daily" },
    { key: 7, label: "Weekly" },
    { key: 30, label: "Monthly" },
    { key: 9999, label: "All Time" },
  ];

  const categoryOptions = [
    { key: "nether", label: "Nether" },
    { key: "bastion", label: "Bastion" },
    { key: "fortress", label: "Fortress" },
    { key: "first_structure", label: "First Structure" },
    { key: "second_structure", label: "Second Structure" },
    { key: "first_portal", label: "First Portal" },
    { key: "second_portal", label: "Second Portal" },
    { key: "stronghold", label: "Stronghold" },
    { key: "end", label: "End" },
    { key: "finish", label: "Finish" },
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
        ref={menuRef}
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
              attributes: type === opt.key ? { selected: true } : undefined,
              image: Platform.select({
                ios: type === opt.key ? "checkmark" : undefined,
                android: type === opt.key ? "ic_menu_add" : undefined,
              }),
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
              image: Platform.select({
                ios: category === opt.key ? "checkmark" : undefined,
                android: category === opt.key ? "ic_menu_add" : undefined,
              }),
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
              attributes: days === opt.key ? { selected: true } : undefined,
              image: Platform.select({
                ios: days === opt.key ? "checkmark" : undefined,
                android: days === opt.key ? "ic_menu_add" : undefined,
              }),
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
