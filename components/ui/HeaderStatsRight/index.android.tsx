import { View } from "react-native";
import { MenuView } from "@react-native-menu/menu";
import { Ionicons } from "@expo/vector-icons";
import { useColorsForUI } from "@/hooks/useColorsForUI";
import {
  sortByFilters,
  categoriesFilters,
  daysFilters,
  HeaderStatsRightProps,
  SortByType,
  CategoriesType,
  DaysType,
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
      <MenuView
        title="Filter Stats"
        onPressAction={({ nativeEvent }) => {
          const actionId = nativeEvent.event;

          if (sortByFilters.some((filter) => filter.key === actionId)) {
            onSortSelect(actionId as SortByType);
          } else if (categoriesFilters.some((filter) => filter.key === actionId)) {
            onCategorySelect(actionId as CategoriesType);
          } else if (daysFilters.some((filter) => filter.key.toString() === actionId)) {
            onDaysSelect(parseInt(actionId) as unknown as DaysType);
          }
        }}
        actions={[
          {
            id: "sort-by",
            title: "Sort By",
            titleColor: tintColor,
            subactions: sortByFilters.map((filter) => ({
              id: filter.key,
              title: filter.label,
              titleColor: tintColor,
              state: sortBy === filter.key ? "on" : "off",
            })),
          },
          {
            id: "category",
            title: "Category",
            titleColor: tintColor,
            subactions: categoriesFilters.map((filter) => ({
              id: filter.key,
              title: filter.label,
              titleColor: tintColor,
              state: category === filter.key ? "on" : "off",
            })),
          },
          {
            id: "days",
            title: "Time Period",
            titleColor: tintColor,
            subactions: daysFilters.map((filter) => ({
              id: filter.key.toString(),
              title: filter.label,
              titleColor: tintColor,
              state: days === filter.key ? "on" : "off",
            })),
          },
        ]}
      >
        <View className="mr-3">
          <Ionicons name="menu-outline" size={28} color={tintColor} />
        </View>
      </MenuView>
    </View>
  );
};

export default HeaderStatsRight;
