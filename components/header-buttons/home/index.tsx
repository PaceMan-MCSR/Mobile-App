import { gameVersionFilters, HeaderButtonHomeProps } from "@/components/header-buttons/home/options";
import { useColorsForUI } from "@/hooks/useColorsForUI";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import * as DropdownMenu from "zeego/dropdown-menu";

const HeaderButtonHome = ({ liveOnly, gameVersion, onGameVersionSelect, onLiveOnlyToggle }: HeaderButtonHomeProps) => {
  const { tintColor } = useColorsForUI();
  const router = useRouter();

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
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger key="game-version">
            <DropdownMenu.ItemTitle>Select Version</DropdownMenu.ItemTitle>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            {gameVersionFilters.map((filter) => (
              <DropdownMenu.CheckboxItem
                key={filter}
                value={gameVersion === filter}
                onValueChange={(nextValue) => {
                  if (nextValue) onGameVersionSelect(filter);
                }}
              >
                <DropdownMenu.ItemTitle>{filter}</DropdownMenu.ItemTitle>
                <DropdownMenu.ItemIndicator />
              </DropdownMenu.CheckboxItem>
            ))}
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.CheckboxItem key="live-only" value={liveOnly} onValueChange={onLiveOnlyToggle}>
          <DropdownMenu.ItemTitle>Live Only</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIndicator />
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.Item key="settings" onSelect={() => router.push("/settings")}>
          <DropdownMenu.ItemTitle>Settings</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default HeaderButtonHome;
