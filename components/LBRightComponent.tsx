import React from "react";
import { View } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";

interface DropDownMenuProps {
  selectedKey: string;
  onSelect: (key: string) => void;
}

const LBRightComponent = ({ selectedKey, onSelect }: DropDownMenuProps) => {
  const menuItems = [
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
  const isTrophySelected = trophyItems.some((item) => item.key === selectedKey);

  const renderCheckmark = (key: string) => {
    const isSelected = selectedKey === key || (key === "trophy" && isTrophySelected);

    return isSelected ? (
      <DropdownMenu.ItemIcon
        ios={{
          name: "checkmark",
          pointSize: 16,
        }}
      />
    ) : null;
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View className="mr-3">
          <Ionicons name="menu-outline" size={28} color={"white"} />
        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          {menuItems.map(({ key, label }) => (
            <DropdownMenu.Item key={key} onSelect={() => onSelect(key)}>
              <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
              {renderCheckmark(key)}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger key="trophy">
            <DropdownMenu.ItemTitle>Trophy</DropdownMenu.ItemTitle>
            {renderCheckmark("trophy")}
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            {trophyItems.map(({ key, label }) => (
              <DropdownMenu.Item key={key} onSelect={() => onSelect(key)}>
                <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
                {renderCheckmark(key)}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default LBRightComponent;
