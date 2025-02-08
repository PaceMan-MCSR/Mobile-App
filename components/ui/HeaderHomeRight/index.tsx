import * as DropdownMenu from "zeego/dropdown-menu";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorsForUI } from "@/hooks/useColorsForUI";
import { View, Pressable } from "react-native";
import { gameVersionFilters, HeaderHomeRightProps } from "@/components/ui/HeaderHomeRight/options";

const HeaderHomeRight = ({ liveOnly, gameVersion, onGameVersionSelect, onLiveOnlyToggle }: HeaderHomeRightProps) => {
  const { tintColor } = useColorsForUI();

  return (
    <View className="flex flex-row-reverse items-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <View>
            <Ionicons name="menu-outline" size={28} color={tintColor} />
          </View>
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
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <Link href={"/settings"} push asChild>
        <Pressable className="pr-5">
          <Ionicons name="settings-outline" size={24} color={tintColor} />
        </Pressable>
      </Link>
    </View>
  );
};

export default HeaderHomeRight;
