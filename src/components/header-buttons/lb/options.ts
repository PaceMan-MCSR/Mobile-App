export const leaderboardFilters = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "all", label: "Lifetime" },
  { key: "current", label: "Trophy - Current" },
  { key: "season-1", label: "Trophy - Season 1" },
  { key: "season-2", label: "Trophy - Season 2" },
  { key: "season-3", label: "Trophy - Season 3" },
  { key: "season-4", label: "Trophy - Season 4" },
  { key: "season-5", label: "Trophy - Season 5" },
] as const;

export type LeaderboardType = (typeof leaderboardFilters)[number]["key"];
export interface HeaderButtonLBProps {
  leaderboard: LeaderboardType;
  onSelect: (key: LeaderboardType) => void;
}
