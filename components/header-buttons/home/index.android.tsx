import { gameVersionFilters, HeaderButtonHomeProps } from "@/components/header-buttons/home/options";
import { useColorsForUI } from "@/hooks/useColorsForUI";
import { Ionicons } from "@expo/vector-icons";
import { MenuView } from "@react-native-menu/menu";
import { useRouter } from "expo-router";
import { View } from "react-native";

const HeaderButtonHome = ({ liveOnly, gameVersion, onGameVersionSelect, onLiveOnlyToggle }: HeaderButtonHomeProps) => {
  const router = useRouter();
  const { tintColor } = useColorsForUI();

  return (
    <View className="flex flex-row-reverse items-center">
      <MenuView
        title="Menu"
        onPressAction={({ nativeEvent }) => {
          const actionId = nativeEvent.event;

          if (gameVersionFilters.some((filter) => filter === actionId)) {
            onGameVersionSelect(actionId);
          } else if (actionId === "live-only") {
            onLiveOnlyToggle();
          } else if (actionId === "settings") {
            router.push("/settings");
          }
        }}
        actions={[
          {
            id: "game-version",
            title: "Select Version",
            titleColor: tintColor,
            subactions: gameVersionFilters.map((filter) => ({
              id: filter,
              title: filter,
              titleColor: tintColor,
              state: gameVersion === filter ? "on" : "off",
            })),
          },
          {
            id: "live-only",
            title: "Live Only",
            titleColor: tintColor,
            state: liveOnly ? "on" : "off",
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

export default HeaderButtonHome;
