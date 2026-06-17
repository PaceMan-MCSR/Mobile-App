import type { HeaderMenuItem } from "@/components/header-menu";

export const sortByFilters = [
  { key: "count", label: "Count" },
  { key: "average", label: "Average" },
  { key: "fastest", label: "Fastest" },
  { key: "conversion", label: "Conversion" },
] as const;

export const categoriesFilters = [
  { key: "nether", label: "Nether Enter" },
  { key: "bastion", label: "Bastion Enter" },
  { key: "fortress", label: "Fortress Enter" },
  { key: "first_structure", label: "Structure 1 Enter" },
  { key: "second_structure", label: "Structure 2 Enter" },
  { key: "first_portal", label: "First Portal" },
  { key: "second_portal", label: "Second Portal" },
  { key: "stronghold", label: "Stronghold Enter" },
  { key: "end", label: "End Enter" },
  { key: "finish", label: "Completion" },
] as const;

export const daysFilters = [
  { key: 1, label: "Daily" },
  { key: 7, label: "Weekly" },
  { key: 30, label: "Monthly" },
  { key: 9999, label: "All Time" },
] as const;

export type SortByType = (typeof sortByFilters)[number]["key"];
export type CategoriesType = (typeof categoriesFilters)[number]["key"];
export type DaysType = (typeof daysFilters)[number]["key"];

export interface StatsMenuParams {
  sortBy: SortByType;
  category: CategoriesType;
  days: DaysType;
  onSortSelect: (sortBy: SortByType) => void;
  onCategorySelect: (category: CategoriesType) => void;
  onDaysSelect: (days: DaysType) => void;
}

export function buildStatsMenuItems({
  sortBy,
  category,
  days,
  onSortSelect,
  onCategorySelect,
  onDaysSelect,
}: StatsMenuParams): HeaderMenuItem[] {
  return [
    {
      type: "submenu",
      key: "sort-by",
      title: "Sort By",
      items: sortByFilters.map((filter) => ({
        type: "action",
        key: filter.key,
        title: filter.label,
        isOn: sortBy === filter.key,
        onPress: () => onSortSelect(filter.key),
      })),
    },
    {
      type: "submenu",
      key: "category",
      title: "Category",
      items: categoriesFilters.map((filter) => ({
        type: "action",
        key: filter.key,
        title: filter.label,
        isOn: category === filter.key,
        onPress: () => onCategorySelect(filter.key),
      })),
    },
    {
      type: "submenu",
      key: "days",
      title: "Time Period",
      items: daysFilters.map((filter) => ({
        type: "action",
        key: String(filter.key),
        title: filter.label,
        isOn: days === filter.key,
        onPress: () => onDaysSelect(filter.key),
      })),
    },
  ];
}
