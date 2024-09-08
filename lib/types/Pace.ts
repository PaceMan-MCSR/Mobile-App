export interface Pace {
  worldId: string;
  gameVersion: string;
  eventList: EventList[];
  contextEventList: EventList[];
  user: {
    uuid: string;
    liveAccount: null | string;
  };
  isCheated: boolean;
  isHidden: boolean;
  lastUpdated: number;
  nickname: string;
  itemData?: ItemData;
}

export interface PaceCardProps {
  pace: Pace;
  index: number;
}

export interface ItemData {
  estimatedCounts: {
    "minecraft:ender_pearl"?: number;
    "minecraft:blaze_rod"?: number;
    "minecraft:obsidian"?: number;
  };
  usages: {
    "minecraft:ender_pearl"?: number;
    "minecraft:obsidian"?: number;
  };
}
export interface EventList {
  eventId: string;
  rta: number;
  igt: number;
}
