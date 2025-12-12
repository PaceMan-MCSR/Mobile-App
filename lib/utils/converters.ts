import Completion from "@/lib/types/Completion";
import { Event, Pace } from "@/lib/types/Pace";
import { World, WorldData } from "@/lib/types/World";

export const eventIdToName = new Map<string, string>([
  ["rsg.enter_nether", "Enter Nether"],
  ["rsg.enter_bastion", "Enter Bastion"],
  ["rsg.enter_fortress", "Enter Fortress"],
  ["rsg.first_portal", "First Portal"],
  ["rsg.second_portal", "Second Portal"],
  ["rsg.enter_stronghold", "Enter Stronghold"],
  ["rsg.enter_end", "Enter End"],
  ["rsg.credits", "Finish"],

  ["rsg.killed_blaze", "Killed Blaze"],
  ["rsg.tower_start", "Tower Start"],
  ["rsg.break_underground_bookshelf", "Enter Library"],
  ["rsg.obtain_gold_block", "Loot Monument"],
  ["rsg.trade", "Villager Trade"],
]);

export const eventOrder = new Map([
  ["rsg.enter_nether", 0],
  ["rsg.enter_bastion", 1],
  ["rsg.enter_fortress", 2],
  ["rsg.first_portal", 3],
  ["rsg.second_portal", 4],
  ["rsg.enter_stronghold", 5],
  ["rsg.enter_end", 6],
  ["rsg.credits", 7],

  ["rsg.killed_blaze", 2],
  ["rsg.tower_start", 3],
  ["rsg.break_underground_bookshelf", 6],
  ["rsg.obtain_gold_block", -2],
  ["rsg.trade", -1],
]);

export const goodPaceSplits = new Map([
  ["s2", 270000], // 4:30
  ["rsg.first_portal", 360000], // 6:00
  ["rsg.enter_stronghold", 450000], // 7:30
  ["rsg.enter_end", 480000], // 8:00
  ["rsg.credits", 600000], // 10:00
]);

export const worldFieldToEventName = new Map<string, string>([
  ["nether", "Enter Nether"],
  ["bastion", "Enter Bastion"],
  ["fortress", "Enter Fortress"],
  ["first_portal", "First Portal"],
  ["stronghold", "Enter Stronghold"],
  ["end", "Enter End"],
  ["finish", "Finish"],
]);

export const isHighQualityPace = (
  gameVersion: string,
  eventList: { eventId: string; igt: number }[],
  latestEvent: { eventId: string; igt: number }
): boolean => {
  if (gameVersion !== "1.16.1") return false;

  if (eventList.length === 3) {
    return latestEvent.igt <= goodPaceSplits.get("s2")!;
  }

  // Check if the latest event has a "good pace" threshold
  if (goodPaceSplits.has(latestEvent.eventId)) {
    return latestEvent.igt <= goodPaceSplits.get(latestEvent.eventId)!;
  }

  return false;
};

export const liverunsToPace = (paceItems: any[]): Pace[] => {
  const filteredPace = paceItems.filter((p) => !p.isCheated && !p.isHidden);
  const mappedPace: Pace[] = [];
  for (const p of filteredPace) {
    const latestEvent = p.eventList[p.eventList.length - 1];
    if (!eventIdToName.has(latestEvent.eventId)) {
      continue;
    }

    const formattedEventList: Event[] = p.eventList.map((e: any) => ({
      name: eventIdToName.get(e.eventId)!,
      time: e.igt,
    }));

    mappedPace.push({
      nickname: p.nickname,
      worldId: p.worldId,
      split: eventOrder.get(latestEvent.eventId) || 0,
      splitName: eventIdToName.get(latestEvent.eventId)!,
      time: latestEvent.igt,
      eventList: formattedEventList,
      uuid: p.user.uuid,
      twitch: p.user.liveAccount,
      lastUpdated: p.lastUpdated,
      isHighQuality: isHighQualityPace(p.gameVersion, p.eventList, latestEvent),
      isLive: true,
      gameVersion: p.gameVersion,
    });
  }

  return mappedPace;
};

export const worldToPace = (worldItems: World): Pace | null => {
  if (!worldItems) return null;
  const { data, time: lastUpdated, isLive } = worldItems;
  const { nickname, worldId, uuid, twitch, vodId, vodOffset } = data;

  // Create event list from worldItems data
  const eventFields: (keyof WorldData)[] = [
    "nether",
    "bastion",
    "fortress",
    "first_portal",
    "stronghold",
    "end",
    "finish",
  ];
  const eventList: Event[] = eventFields
    .map((field) => {
      const time = data[field];

      if (time === null || time === undefined) {
        return null;
      }

      const name = worldFieldToEventName.get(field);
      if (!name) {
        return null;
      }

      return {
        name,
        time,
      };
    })
    .filter((event): event is Event => event !== null)
    .sort((a, b) => a.time - b.time);

  const isHighQuality = isHighQualityPace(
    "1.16.1",
    eventList.map((e, _) => ({
      eventId: Array.from(worldFieldToEventName.entries()).find(([_, name]) => name === e.name)?.[0] || "",
      igt: e.time,
    })),
    {
      eventId:
        Array.from(worldFieldToEventName.entries()).find(
          ([_, name]) => name === eventList[eventList.length - 1].name
        )?.[0] || "",
      igt: eventList[eventList.length - 1].time,
    }
  );

  return {
    nickname,
    worldId,
    split: eventList.length - 1,
    splitName: eventList[eventList.length - 1].name,
    time: eventList[eventList.length - 1].time,
    eventList,
    uuid,
    twitch,
    lastUpdated,
    isHighQuality,
    gameVersion: "1.16.1",
    isLive,
    vodId,
    vodOffset,
  };
};

export const paceSort = (a: Pace, b: Pace) => {
  if (a.isHighQuality && !b.isHighQuality) {
    return -1;
  }
  if (b.isHighQuality && !a.isHighQuality) {
    return 1;
  }
  // Sort on event count if S1/S2
  // Sort on split index otherwise
  if (
    a.split! === eventOrder.get("rsg.enter_fortress") ||
    b.split! === eventOrder.get("rsg.enter_fortress") ||
    a.split! === eventOrder.get("rsg.enter_bastion") ||
    b.split! === eventOrder.get("rsg.enter_bastion")
  ) {
    if (a.eventList.length > b.eventList.length) {
      return -1;
    } else if (b.eventList.length > a.eventList.length) {
      return 1;
    }
  } else {
    if (a.split! > b.split!) {
      return -1;
    } else if (b.split! > a.split!) {
      return 1;
    }
  }
  // Otherwise splits are the same
  if (a.time < b.time) {
    return -1;
  } else if (b.time < a.time) {
    return 1;
  } else {
    return 0;
  }
};

export const completionSort = (a: Completion, b: Completion) => a.time - b.time;
