import type { HeaderMenuItem } from "@/components/header-menu";

export const gameVersionFilters = ["1.16.1", "1.15.2", "1.7.10", "1.8.9", "1.14.4", "1.12.2", "1.16.5", "1.17.1"];

export interface HomeMenuParams {
  gameVersion: (typeof gameVersionFilters)[number];
  liveOnly: boolean;
  onGameVersionSelect: (version: (typeof gameVersionFilters)[number]) => void;
  onLiveOnlyToggle: () => void;
}

export function buildHomeMenuItems({
  gameVersion,
  liveOnly,
  onGameVersionSelect,
  onLiveOnlyToggle,
}: HomeMenuParams): HeaderMenuItem[] {
  return [
    {
      type: "submenu",
      key: "game-version",
      title: "Select Version",
      items: gameVersionFilters.map((filter) => ({
        type: "action",
        key: filter,
        title: filter,
        isOn: gameVersion === filter,
        onPress: () => onGameVersionSelect(filter),
      })),
    },
    { type: "action", key: "live-only", title: "Live Only", isOn: liveOnly, onPress: onLiveOnlyToggle },
  ];
}
