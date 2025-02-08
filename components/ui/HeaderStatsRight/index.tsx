import * as DropdownMenu from "zeego/dropdown-menu";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorsForUI } from "@/hooks/useColorsForUI";
import {
  sortByFilters,
  categoriesFilters,
  daysFilters,
  HeaderStatsRightProps,
} from "@/components/ui/HeaderStatsRight/options";

const HeaderStatsRight = ({
  sortBy,
  category,
  days,
  onSortSelect,
  onCategorySelect,
  onDaysSelect,
}: HeaderStatsRightProps) => {
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
            <DropdownMenu.SubTrigger key="sort-by">
              <DropdownMenu.ItemTitle>Sort By</DropdownMenu.ItemTitle>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {sortByFilters.map(({ key, label }) => (
                <DropdownMenu.CheckboxItem
                  key={key}
                  value={sortBy === key}
                  onValueChange={(next) => next && onSortSelect(key)}
                >
                  <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
                  <DropdownMenu.ItemIndicator />
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger key="category">
              <DropdownMenu.ItemTitle>Category</DropdownMenu.ItemTitle>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {categoriesFilters.map(({ key, label }) => (
                <DropdownMenu.CheckboxItem
                  key={key}
                  value={category === key}
                  onValueChange={(next) => next && onCategorySelect(key)}
                >
                  <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
                  <DropdownMenu.ItemIndicator />
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger key="days">
              <DropdownMenu.ItemTitle>Time Period</DropdownMenu.ItemTitle>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {daysFilters.map(({ key, label }) => (
                <DropdownMenu.CheckboxItem
                  key={key.toString()}
                  value={days === key}
                  onValueChange={(next) => next && onDaysSelect(key)}
                >
                  <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
                  <DropdownMenu.ItemIndicator />
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </View>
  );
};

export default HeaderStatsRight;
