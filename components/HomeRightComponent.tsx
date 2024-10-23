// components/HomeRightComponent.tsx
import { View } from "react-native";
import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";

interface HomeRightComponentProps {
  liveOnly: boolean;
  onGameVersionSelect: () => void;
  onLiveOnlyToggle: () => void;
}

const HomeRightComponent = ({ liveOnly, onGameVersionSelect, onLiveOnlyToggle }: HomeRightComponentProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View style={{ marginRight: 12 }}>
          <Ionicons name="menu-outline" size={28} color="white" />
        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item key="version" onSelect={onGameVersionSelect}>
          <DropdownMenu.ItemTitle>Select Version</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
        <DropdownMenu.Item key="liveOnly" onSelect={onLiveOnlyToggle}>
          <DropdownMenu.ItemTitle>Live Only</DropdownMenu.ItemTitle>
          {liveOnly && (
            <DropdownMenu.ItemIcon
              ios={{
                name: "checkmark",
                pointSize: 16,
              }}
            />
          )}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default HomeRightComponent;
