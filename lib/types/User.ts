import UserCompletion from "./Completion";

export interface User {
  id: string;
  nick: string;
  twitches: string[];
}

export interface UserData {
  user: {
    uuid: string;
    twitchId: string;
    alt: string;
    daily: number;
    weekly: number;
    monthly: number;
  };
  completions: UserCompletion[];
  pbs: {
    daily: UserCompletion;
    weekly: UserCompletion;
    monthly: UserCompletion;
    allTime: UserCompletion;
  };
}
