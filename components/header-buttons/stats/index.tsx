import {
  categoriesFilters,
  daysFilters,
  HeaderButtonStatsProps,
  sortByFilters,
} from "@/components/header-buttons/stats/options";
import { useColorsForUI } from "@/hooks/useColorsForUI";
import { SymbolView } from "expo-symbols";
import * as DropdownMenu from "zeego/dropdown-menu";

const HeaderButtonStats = ({
  sortBy,
  category,
  days,
  onSortSelect,
  onCategorySelect,
  onDaysSelect,
}: HeaderButtonStatsProps) => {
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
  );
};

export default HeaderButtonStats;
