export const SORT_BY_FILTERS = [
  { key: "count", label: "Count" },
  { key: "average", label: "Average" },
  { key: "fastest", label: "Fastest" },
  { key: "conversion", label: "Conversion" },
] as const;

export const CATEGORIES_FILTERS = [
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

export const DAYS_FILTERS = [
  { key: 1, label: "Daily" },
  { key: 7, label: "Weekly" },
  { key: 30, label: "Monthly" },
  { key: 9999, label: "All Time" },
] as const;

export type SortByType = (typeof SORT_BY_FILTERS)[number]["key"];
export type CategoriesType = (typeof CATEGORIES_FILTERS)[number]["key"];
export type DaysType = (typeof DAYS_FILTERS)[number]["key"];
