import React from "react";
import { View } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";

interface DropDownMenuProps {
  selectedKey: string;
  onSelect: (key: string) => void;
}

const LBRightComponent = ({ selectedKey, onSelect }: DropDownMenuProps) => {
  const renderCheckmark = (key: string) => {
    const isSelected = selectedKey === key;

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
          {/* DAILY TRIGGER */}
          <DropdownMenu.Item key="daily" onSelect={() => onSelect("daily")}>
            <DropdownMenu.ItemTitle>Daily</DropdownMenu.ItemTitle>
            {renderCheckmark("daily")}
          </DropdownMenu.Item>
          {/* WEEKLY TRIGGER */}
          <DropdownMenu.Item key="weekly" onSelect={() => onSelect("weekly")}>
            <DropdownMenu.ItemTitle>Weekly</DropdownMenu.ItemTitle>
            {renderCheckmark("weekly")}
          </DropdownMenu.Item>
          {/* MONTHLY TRIGGER */}
          <DropdownMenu.Item key="monthly" onSelect={() => onSelect("monthly")}>
            <DropdownMenu.ItemTitle>Monthly</DropdownMenu.ItemTitle>
            {renderCheckmark("monthly")}
          </DropdownMenu.Item>
          {/* ALL TRIGGER */}
          <DropdownMenu.Item key="all" onSelect={() => onSelect("all")}>
            <DropdownMenu.ItemTitle>All</DropdownMenu.ItemTitle>
            {renderCheckmark("all")}
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Sub>
          {/* TROPHY TRIGGER */}
          <DropdownMenu.SubTrigger key="trophy">
            <DropdownMenu.ItemTitle>Trophy</DropdownMenu.ItemTitle>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            {/* TROPHY-CURRENT TRIGGER */}
            <DropdownMenu.Item key="trophy-current" onSelect={() => onSelect("trophy-current")}>
              <DropdownMenu.ItemTitle>Current</DropdownMenu.ItemTitle>
              {selectedKey === "trophy-current" && (
                <DropdownMenu.ItemIcon
                  ios={{
                    name: "checkmark",
                    pointSize: 16,
                  }}
                />
              )}
            </DropdownMenu.Item>
            {/* TROPHY-SEASON-1 TRIGGER */}
            <DropdownMenu.Item key="trophy-season-1" onSelect={() => onSelect("trophy-season-1")}>
              <DropdownMenu.ItemTitle>Season 1</DropdownMenu.ItemTitle>
              {renderCheckmark("trophy-season-1")}
            </DropdownMenu.Item>
            {/* TROPHY-SEASON-2 TRIGGER */}
            <DropdownMenu.Item key="trophy-season-2" onSelect={() => onSelect("trophy-season-2")}>
              <DropdownMenu.ItemTitle>Season 2</DropdownMenu.ItemTitle>
              {renderCheckmark("trophy-season-2")}
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default LBRightComponent;
