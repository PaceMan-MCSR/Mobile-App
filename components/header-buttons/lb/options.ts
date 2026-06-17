import type { HeaderMenuItem } from "@/components/header-menu";

// Top-level leaderboard filters shown directly in the menu.
const topLevelFilters = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "all", label: "Lifetime" },
] as const;

// Trophy filters grouped under a "Trophy" submenu (labels are submenu-relative).
const trophyFilters = [
  { key: "current", label: "Current" },
  { key: "season-1", label: "Season 1" },
  { key: "season-2", label: "Season 2" },
  { key: "season-3", label: "Season 3" },
  { key: "season-4", label: "Season 4" },
  { key: "season-5", label: "Season 5" },
] as const;

export type LeaderboardType =
  | (typeof topLevelFilters)[number]["key"]
  | (typeof trophyFilters)[number]["key"];

export interface LeaderboardMenuParams {
  leaderboard: LeaderboardType;
  onSelect: (key: LeaderboardType) => void;
}

export function buildLeaderboardMenuItems({ leaderboard, onSelect }: LeaderboardMenuParams): HeaderMenuItem[] {
  // `isOn` is driven by the single selected `leaderboard` for every item — top-level and
  // nested alike — so exactly one shared checkmark shows across the whole menu.
  return [
    ...topLevelFilters.map((filter) => ({
      type: "action" as const,
      key: filter.key,
      title: filter.label,
      isOn: leaderboard === filter.key,
      onPress: () => onSelect(filter.key),
    })),
    {
      type: "submenu",
      key: "trophy",
      title: "Trophy",
      items: trophyFilters.map((filter) => ({
        type: "action",
        key: filter.key,
        title: filter.label,
        isOn: leaderboard === filter.key,
        onPress: () => onSelect(filter.key),
      })),
    },
  ];
}
