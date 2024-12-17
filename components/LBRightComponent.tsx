import React from "react";
import { View } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";

interface DropDownMenuProps {
  selectedKey: string;
  onSelect: (key: string) => void;
}

const LBRightComponent = ({ selectedKey, onSelect }: DropDownMenuProps) => {
  const { colorScheme } = useColorScheme();
  const tint = Colors[colorScheme!].tint;
  const menuItems = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "all", label: "All" },
    { key: "current", label: "Trophy - Current" },
    { key: "season-1", label: "Trophy - Season 1" },
    { key: "season-2", label: "Trophy - Season 2" },
  ];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View>
          <Ionicons name="menu-outline" size={28} color={tint} />
        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {menuItems.map(({ key, label }) => (
          <DropdownMenu.CheckboxItem
            key={key}
            value={selectedKey === key}
            onValueChange={(next) => next && onSelect(key)}
          >
            <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIndicator />
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default LBRightComponent;
