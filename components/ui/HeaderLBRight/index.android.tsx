import { View } from "react-native";
import { MenuView } from "@react-native-menu/menu";
import { Ionicons } from "@expo/vector-icons";
import { useColorsForUI } from "@/hooks/useColorsForUI";
import { leaderboardFilters, HeaderLBRightProps, LeaderboardType } from "@/components/ui/HeaderLBRight/options";

const HeaderLBRight = ({ leaderboard, onSelect }: HeaderLBRightProps) => {
  const { tintColor } = useColorsForUI();

  return (
    <View className="flex flex-row-reverse items-center">
      <MenuView
        title="Menu"
        onPressAction={({ nativeEvent }) => {
          const actionId = nativeEvent.event;
          if (leaderboardFilters.some(({ key }) => key === actionId)) {
            onSelect(actionId as LeaderboardType);
          }
        }}
        actions={leaderboardFilters.map(({ key, label }) => ({
          id: key,
          title: label,
          titleColor: tintColor,
          state: leaderboard === key ? "on" : "off",
        }))}
      >
        <View className="mr-3">
          <Ionicons name="menu-outline" size={28} color={tintColor} />
        </View>
      </MenuView>
    </View>
  );
};

export default HeaderLBRight;
