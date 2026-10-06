import { gameVersionFilters, HeaderButtonHomeProps } from "@/components/header-buttons/home/options";
import MenuIcon from "@expo/material-symbols/menu.xml";
import { Stack } from "expo-router";

const HeaderButtonHome = ({ liveOnly, gameVersion, onGameVersionSelect, onLiveOnlyToggle }: HeaderButtonHomeProps) => {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu
        icon={process.env.EXPO_OS === "ios" ? "line.3.horizontal" : MenuIcon}
        accessibilityLabel="Home filters"
      >
        <Stack.Toolbar.Menu title="Select Version">
          {gameVersionFilters.map((filter) => (
            <Stack.Toolbar.MenuAction
              key={filter}
              isOn={gameVersion === filter}
              onPress={() => onGameVersionSelect(filter)}
            >
              {filter}
            </Stack.Toolbar.MenuAction>
          ))}
        </Stack.Toolbar.Menu>
        <Stack.Toolbar.MenuAction isOn={liveOnly} onPress={onLiveOnlyToggle}>
          Live Only
        </Stack.Toolbar.MenuAction>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
};

export default HeaderButtonHome;
