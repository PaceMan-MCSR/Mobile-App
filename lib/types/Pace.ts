export interface Event {
  eventId: any;
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
  itemEstimates?: any;
  gameVersion: string;
}

export interface PaceSettings {
  gameVersion: string;
  liveOnly: boolean;
}
