import React, { useRef } from "react";
import { View, Text, Platform, Pressable } from "react-native";
import { MenuView } from "@react-native-menu/menu";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Link, useRouter } from "expo-router";

interface HomeRightComponentProps {
  liveOnly: boolean;
  gameVersion: string;
  onGameVersionSelect: (key: string) => void;
  onLiveOnlyToggle: () => void;
}

const HomeRightComponent: React.FC<HomeRightComponentProps> = ({
  liveOnly,
  gameVersion,
  onGameVersionSelect,
  onLiveOnlyToggle,
}) => {
  const menuRef = useRef<MenuView>(null);
  const { colorScheme } = useColorScheme();
  const router = useRouter();

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

  // Determine text color based on color scheme
  const getTextColor = () => (colorScheme === "dark" ? "#FFFFFF" : "#000000");

  return (
    <View className="flex flex-row-reverse items-center">
      <MenuView
        ref={menuRef}
        title="Menu"
        onPressAction={({ nativeEvent }) => {
          const actionId = nativeEvent.event;

          if (actionId === "liveOnly") {
            onLiveOnlyToggle();
          } else if (versions.some((v) => v.key === actionId)) {
            onGameVersionSelect(actionId);
          }
        }}
        actions={[
          {
            id: "version",
            title: "Select Version",
            titleColor: getTextColor(),
            subactions: versions.map((version) => ({
              id: version.key,
              title: version.label,
              titleColor: getTextColor(),
            })),
          },
          {
            id: "liveOnly",
            title: "Live Only",
            titleColor: getTextColor(),
          },
        ]}
      >
        <View className="mr-3">
          <Ionicons name="menu-outline" size={28} color={"#FFFFFF"} />
        </View>
      </MenuView>
      <Link href={"/settings"} push asChild>
        <Pressable className="pr-5">
          <Ionicons name="settings-outline" size={24} color="white" />
        </Pressable>
      </Link>
    </View>
  );
};

export default HomeRightComponent;
