export interface WorldData {
  id: number;
  worldId: string;
  nickname: string;
  uuid: string;
  twitch: string | null;
  nether: number | null;
  bastion: number | null;
  fortress: number | null;
  first_portal: number | null;
  stronghold: number | null;
  end: number | null;
  finish: number | null;
  netherRta: number | null;
  bastionRta: number | null;
  fortressRta: number | null;
  first_portalRta: number | null;
  strongholdRta: number | null;
  endRta: number | null;
  finishRta: number | null;
  insertTime: number;
  updateTime: number;
  vodId: number | null;
  vodOffset: number | null;
}

export interface World {
  data: WorldData;
  time: number;
  isLive: boolean;
}
