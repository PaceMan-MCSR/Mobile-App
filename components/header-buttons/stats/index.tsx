import {
  categoriesFilters,
  daysFilters,
  HeaderButtonStatsProps,
  sortByFilters,
} from "@/components/header-buttons/stats/options";
import MenuIcon from "@expo/material-symbols/menu.xml";
import { Stack } from "expo-router";

const HeaderButtonStats = ({
  sortBy,
  category,
  days,
  onSortSelect,
  onCategorySelect,
  onDaysSelect,
}: HeaderButtonStatsProps) => {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu
        icon={process.env.EXPO_OS === "ios" ? "line.3.horizontal" : MenuIcon}
        accessibilityLabel="Stats filters"
      >
        <Stack.Toolbar.Menu title="Sort By">
          {sortByFilters.map(({ key, label }) => (
            <Stack.Toolbar.MenuAction
              key={key}
              isOn={sortBy === key}
              onPress={() => onSortSelect(key)}
            >
              {label}
            </Stack.Toolbar.MenuAction>
          ))}
        </Stack.Toolbar.Menu>

        <Stack.Toolbar.Menu title="Category">
          {categoriesFilters.map(({ key, label }) => (
            <Stack.Toolbar.MenuAction
              key={key}
              isOn={category === key}
              onPress={() => onCategorySelect(key)}
            >
              {label}
            </Stack.Toolbar.MenuAction>
          ))}
        </Stack.Toolbar.Menu>

        <Stack.Toolbar.Menu title="Time Period">
          {daysFilters.map(({ key, label }) => (
            <Stack.Toolbar.MenuAction
              key={key.toString()}
              isOn={days === key}
              onPress={() => onDaysSelect(key)}
            >
              {label}
            </Stack.Toolbar.MenuAction>
          ))}
        </Stack.Toolbar.Menu>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
};

export default HeaderButtonStats;
