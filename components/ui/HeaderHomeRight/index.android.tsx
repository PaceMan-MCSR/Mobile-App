import { View } from "react-native";
import { MenuView } from "@react-native-menu/menu";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorsForUI } from "@/hooks/useColorsForUI";
import { gameVersionFilters, HeaderHomeRightProps } from "@/components/ui/HeaderHomeRight/options";

const HeaderHomeRight = ({ liveOnly, gameVersion, onGameVersionSelect, onLiveOnlyToggle }: HeaderHomeRightProps) => {
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

export default HeaderHomeRight;
