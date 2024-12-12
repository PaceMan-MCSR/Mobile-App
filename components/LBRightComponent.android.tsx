import React, { useRef } from "react";
import { View, Platform } from "react-native";
import { MenuView } from "@react-native-menu/menu";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

interface DropDownMenuProps {
  selectedKey: string;
  onSelect: (key: string) => void;
}

const LBRightComponent: React.FC<DropDownMenuProps> = ({ selectedKey, onSelect }) => {
  const menuRef = useRef<MenuView>(null);
  const { colorScheme } = useColorScheme();

  const leaderboardItems = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "all", label: "All" },
  ];

  const trophyItems = [
    { key: "current", label: "Current" },
    { key: "season-1", label: "Season 1" },
    { key: "season-2", label: "Season 2" },
  ];

  // Determine text color based on color scheme
  const getTextColor = () => (colorScheme === "dark" ? "#FFFFFF" : "#000000");

  // Check if a trophy item is selected
  const isTrophySelected = trophyItems.some((item) => item.key === selectedKey);

  return (
    <View className="flex flex-row-reverse items-center">
      <MenuView
        ref={menuRef}
        title="Menu"
        onPressAction={({ nativeEvent }) => {
          const actionId = nativeEvent.event;

          // Handle leaderboard items
          if (leaderboardItems.some((item) => item.key === actionId)) {
            onSelect(actionId);
          }

          // Handle trophy items
          if (trophyItems.some((item) => item.key === actionId)) {
            onSelect(actionId);
          }
        }}
        actions={[
          ...leaderboardItems.map((item) => ({
            id: item.key,
            title: item.label,
            titleColor: getTextColor(),
            state: selectedKey === item.key ? "on" : "off",
            attributes: selectedKey === item.key ? { selected: true } : undefined,
            image: Platform.select({
              ios: selectedKey === item.key ? "checkmark" : undefined,
              android: selectedKey === item.key ? "ic_menu_add" : undefined,
            }),
          })),
          // Trophy as a submenu
          {
            id: "trophy",
            title: "Trophy",
            titleColor: getTextColor(),
            state: isTrophySelected ? "on" : "off",
            attributes: isTrophySelected ? { selected: true } : undefined,
            image: Platform.select({
              ios: isTrophySelected ? "checkmark" : undefined,
              android: isTrophySelected ? "ic_menu_add" : undefined,
            }),
            subactions: trophyItems.map((item) => ({
              id: item.key,
              title: item.label,
              titleColor: getTextColor(),
              state: selectedKey === item.key ? "on" : "off",
              attributes: selectedKey === item.key ? { selected: true } : undefined,
              image: Platform.select({
                ios: selectedKey === item.key ? "checkmark" : undefined,
                android: selectedKey === item.key ? "ic_menu_add" : undefined,
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

export default LBRightComponent;
