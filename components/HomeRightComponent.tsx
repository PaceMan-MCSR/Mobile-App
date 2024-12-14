import { View } from "react-native";
import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { Link } from "expo-router";

interface HomeRightComponentProps {
  liveOnly: boolean;
  gameVersion: string;
  onGameVersionSelect: (key: string) => void;
  onLiveOnlyToggle: () => void;
}

const HomeRightComponent = ({
  liveOnly,
  gameVersion,
  onGameVersionSelect,
  onLiveOnlyToggle,
}: HomeRightComponentProps) => {
  const versions = [
    { key: "1.16.1", label: "1.16.1" },
    { key: "1.15.2", label: "1.15.2" },
    { key: "1.7.10", label: "1.7.10" },
    { key: "1.8.9", label: "1.8.9" },
    { key: "1.14.4", label: "1.14.4" },
    { key: "1.12.2", label: "1.12.2" },
    { key: "1.16.5", label: "1.16.5" },
    { key: "1.17.1", label: "1.17.1" },
  ];

  return (
    <View className="flex flex-row-reverse items-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <View>
            <Ionicons name="menu-outline" size={28} color="white" />
          </View>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger key="version">
              <DropdownMenu.ItemTitle>Select Version</DropdownMenu.ItemTitle>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {versions.map(({ key, label }) => (
                <DropdownMenu.CheckboxItem
                  key={key}
                  value={gameVersion === key}
                  onValueChange={(nextValue) => {
                    if (nextValue) onGameVersionSelect(key);
                  }}
                >
                  <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
                  <DropdownMenu.ItemIndicator />
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.CheckboxItem key="liveOnly" value={liveOnly} onValueChange={onLiveOnlyToggle}>
            <DropdownMenu.ItemTitle>Live Only</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIndicator />
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <Link href={"/settings"} push asChild>
        <Pressable className="pr-5">
          <Ionicons name="settings-outline" size={24} color="white" />
        </Pressable>
      </Link>
    </View>
  );
};

export default HomeRightComponent;
