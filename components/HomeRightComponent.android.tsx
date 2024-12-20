import React from "react";
import { View } from "react-native";
import { MenuView } from "@react-native-menu/menu";
import { Ionicons } from "@expo/vector-icons";
import { useColorsForUI } from "@/hooks/useColorsForUI";
import { useColorScheme } from "nativewind";
import { useRouter } from "expo-router";

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
  const { tintColor } = useColorsForUI();
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
  const getTextColor = () => tintColor;

  return (
    <View className="flex flex-row-reverse items-center">
      <MenuView
        title="Menu"
        onPressAction={({ nativeEvent }) => {
          const actionId = nativeEvent.event;

          if (actionId === "liveOnly") {
            onLiveOnlyToggle();
          } else if (versions.some((v) => v.key === actionId)) {
            onGameVersionSelect(actionId);
          } else if (actionId === "settings") {
            router.push("/settings");
          }
        }}
        actions={[
          {
            id: "version",
            title: "Select Version",
            titleColor: tintColor,
            subactions: versions.map((version) => ({
              id: version.key,
              title: version.label,
              titleColor: tintColor,
              state: gameVersion === version.key ? "on" : "off",
              attributes: gameVersion === version.key ? { selected: true } : undefined,
            })),
          },
          {
            id: "liveOnly",
            title: "Live Only",
            titleColor: tintColor,
            state: liveOnly ? "on" : "off",
            attributes: liveOnly ? { selected: true } : undefined,
          },
          {
            id: "settings",
            title: "Settings",
            titleColor: tintColor,
          },
        ]}
      >
        <View className="mr-3">
          <Ionicons name="menu-outline" size={28} color={tintColor} />
        </View>
      </MenuView>
    </View>
  );
};

export default HomeRightComponent;
