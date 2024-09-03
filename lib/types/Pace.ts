export interface Event {
  name: string;
  time: number;
}

export interface Pace {
  worldId: string;
  nickname: string;
  split?: number;
  splitName: string;
  eventList: (string | number)[];
  time: number;
  user: { uuid: string };
  twitch: string | null;
  lastUpdated: number;
  isHighQuality: boolean;
  itemEstimates?: any;
}
