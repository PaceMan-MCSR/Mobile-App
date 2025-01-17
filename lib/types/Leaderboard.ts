import Completion from "./Completion";

export default interface LeaderboardEntry extends Completion {
  worldId: string;
  submitted: number;
}

export interface TrophyEntry {
  uuid: string;
  nickname: string;
  twitchId: string;
  alt: string | null;
  daily: number;
  weekly: number;
  monthly: number;
  score: number;
  pb: number;
  bonus: number;
  lifetimeBonus: number;
  lifetimeDaily: number;
  lifetimeMonthly: number;
  lifetimeWeekly: number;
}
