export const gameVersionFilters = ["1.16.1", "1.15.2", "1.7.10", "1.8.9", "1.14.4", "1.12.2", "1.16.5", "1.17.1"];

export interface HeaderHomeRightProps {
  liveOnly: boolean;
  gameVersion: (typeof gameVersionFilters)[number];
  onLiveOnlyToggle: () => void;
  onGameVersionSelect: (key: (typeof gameVersionFilters)[number]) => void;
}
