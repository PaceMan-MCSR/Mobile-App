import { Pressable, View } from "react-native";
import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface HomeRightComponentProps {
  liveOnly: boolean;
  onGameVersionSelect: () => void;
  onLiveOnlyToggle: (next: boolean) => void;
}

const HomeRightComponent = ({ liveOnly, onGameVersionSelect, onLiveOnlyToggle }: HomeRightComponentProps) => {
  const router = useRouter();

  return (
    <View className="flex flex-row-reverse items-center">
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
          <DropdownMenu.CheckboxItem
            value={liveOnly}
            key="fernando"
            onValueChange={(next, previous) => onLiveOnlyToggle(next)}
          >
            <DropdownMenu.ItemTitle>Live Only</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIndicator />
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <Pressable style={{ marginRight: 12 }} onPress={() => router.push("/settings")}>
        <Ionicons name="settings-outline" size={24} color="white" />
      </Pressable>
    </View>
  );
};

export default HomeRightComponent;
