import * as DropdownMenu from "zeego/dropdown-menu";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorsForUI } from "@/hooks/useColorsForUI";
import { leaderboardFilters, HeaderLBRightProps } from "@/components/ui/HeaderLBRight/options";

const HeaderLBRight = ({ leaderboard, onSelect }: HeaderLBRightProps) => {
  const { tintColor } = useColorsForUI();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View>
          <Ionicons name="menu-outline" size={28} color={tintColor} />
        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {leaderboardFilters.map(({ key, label }) => (
          <DropdownMenu.CheckboxItem
            key={key}
            value={leaderboard === key}
            onValueChange={(next) => next && onSelect(key)}
          >
            <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default HeaderLBRight;
