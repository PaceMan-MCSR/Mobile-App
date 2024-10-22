import { View } from "react-native";
import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";

interface LBDropdownMenuProps {
  onSelect: (key: string) => void;
}

const LBDropdownMenu = ({ onSelect }: LBDropdownMenuProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View className="mr-4">
          <Ionicons name="menu-outline" size={28} color={"white"} />
        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Item key="0" onSelect={() => onSelect("0")}>
            <DropdownMenu.ItemTitle>Daily</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          <DropdownMenu.Item key="1" onSelect={() => onSelect("1")}>
            <DropdownMenu.ItemTitle>Weekly</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          <DropdownMenu.Item key="2" onSelect={() => onSelect("2")}>
            <DropdownMenu.ItemTitle>Monthly</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          <DropdownMenu.Item key="3" onSelect={() => onSelect("3")}>
            <DropdownMenu.ItemTitle>All</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Item key="4" onSelect={() => onSelect("4")}>
          <DropdownMenu.ItemTitle>Trophy</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default LBDropdownMenu;
