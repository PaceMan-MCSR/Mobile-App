import { HeaderButtonLBProps, leaderboardFilters } from "@/components/header-buttons/lb/options";
import { useColorsForUI } from "@/hooks/useColorsForUI";
import { SymbolView } from "expo-symbols";
import * as DropdownMenu from "zeego/dropdown-menu";

const HeaderButtonLB = ({ leaderboard, onSelect }: HeaderButtonLBProps) => {
  const { tintColor } = useColorsForUI();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <SymbolView
          name="line.3.horizontal"
          style={{
            width: 25,
            height: 25,
            margin: 5,
          }}
          tintColor={tintColor}
          type="hierarchical"
        />
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

export default HeaderButtonLB;
