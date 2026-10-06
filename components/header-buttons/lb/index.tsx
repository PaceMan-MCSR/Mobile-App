import { HeaderButtonLBProps, leaderboardFilters } from "@/components/header-buttons/lb/options";
import MenuIcon from "@expo/material-symbols/menu.xml";
import { Stack } from "expo-router";

const HeaderButtonLB = ({ leaderboard, onSelect }: HeaderButtonLBProps) => {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu
        icon={process.env.EXPO_OS === "ios" ? "line.3.horizontal" : MenuIcon}
        accessibilityLabel="Leaderboard filters"
      >
        {leaderboardFilters.map(({ key, label }) => (
          <Stack.Toolbar.MenuAction
            key={key}
            isOn={leaderboard === key}
            onPress={() => onSelect(key)}
          >
            {label}
          </Stack.Toolbar.MenuAction>
        ))}
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
};

export default HeaderButtonLB;
