export interface Event {
  name: string;
  time: number;
}

export interface Pace {
  nickname: string;
  worldId: string;
  split?: number;
  splitName: string;
  eventList: Event[];
  time: number;
  uuid: string;
  twitch: string | null;
  lastUpdated: number;
  isHighQuality: boolean;
  gameVersion: string;
  isLive?: boolean;
  vodId?: number | null;
  vodOffset?: number | null;
}

export interface PaceSettings {
  gameVersion: string;
  liveOnly: boolean;
}
