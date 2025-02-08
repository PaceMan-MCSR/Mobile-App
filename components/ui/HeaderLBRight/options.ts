export const leaderboardFilters = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "all", label: "All" },
  { key: "current", label: "Trophy - Current" },
  { key: "season-1", label: "Trophy - Season 1" },
  { key: "season-2", label: "Trophy - Season 2" },
  { key: "season-3", label: "Trophy - Season 3" },
] as const;

export type LeaderboardType = (typeof leaderboardFilters)[number]["key"];
export interface HeaderLBRightProps {
  leaderboard: LeaderboardType;
  onSelect: (key: LeaderboardType) => void;
}
