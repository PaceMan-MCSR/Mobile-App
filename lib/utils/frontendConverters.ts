// Shamelessly taken from https://github.com/Specnr/PaceMan.gg/ :P

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useColorScheme } from "nativewind";

dayjs.extend(utc);
dayjs.extend(timezone);

interface EventWithTime {
  splitName: string;
  splitTime: number | "N/A";
}

export const msToTime = (ms: number, keepMs = false): string => {
  let milliseconds = Math.floor((ms % 1000) / 100),
    seconds = Math.floor((ms / 1000) % 60),
    minutes = Math.floor((ms / (1000 * 60)) % 60);

  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  const secondsStr = seconds < 10 ? "0" + seconds : seconds;

  let ret = minutesStr + ":" + secondsStr;
  if (keepMs) {
    ret += "." + milliseconds;
  }
  return ret;
};

export const msToDate = (ms: number) => dayjs(ms).format("MM/DD/YYYY");

export const uuidToHead = (uuid: string): string => {
  const endpoint = "https://api.mineatar.io/face/";
  return `${endpoint}${uuid}`;
};

export const uuidToSkin = (uuid: string): string => {
  const endpoint = "https://mc-heads.net/body/";
  return `${endpoint}${uuid}`;
};

export const tintColor = () => {
  const { colorScheme } = useColorScheme();
  colorScheme === "dark" ? "white" : "black";
};

export const backgroundColor = () => {
  const { colorScheme } = useColorScheme();
  colorScheme === "dark" ? "#FFFFFF" : "#1f2937";
};

// https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
export const ordinalSuffix = (i: number): string => {
  const j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) return i + "st";
  if (j === 2 && k !== 12) return i + "nd";
  if (j === 3 && k !== 13) return i + "rd";
  return i + "th";
};

export const EVENT_ID_NAME = [
  "Enter Nether",
  "Enter Bastion",
  "Enter Fortress",
  "First Portal",
  "Second Portal",
  "Enter Stronghold",
  "Enter End",
  "Finish",
];

export const lastUpdatedDifference = (lastUpdated: number, latestSplit: number) => {
  const now = dayjs().tz("America/Toronto").valueOf();
  return msToTime(latestSplit + now - lastUpdated);
};

export const createDateFromInput = (date: dayjs.Dayjs) => {
  date = date ?? dayjs();

  const [d, m, y] = [date.get("date"), date.get("month"), date.get("year")];

  const newDate = date.tz("America/Toronto");
  newDate.set("date", d);
  newDate.set("month", m);
  newDate.set("year", y);

  return newDate.valueOf();
};

export const isUserLive = (liveAccount: string | null) => liveAccount !== null;

export const fracToPerc = (frac: number) => `${Math.round(frac * 10000) / 100}%`;

export const eventIdToName = new Map<string, string>([
  ["rsg.enter_nether", "Enter Nether"],
  ["rsg.enter_bastion", "Enter Bastion"],
  ["rsg.enter_fortress", "Enter Fortress"],
  ["rsg.first_portal", "First Portal"],
  ["rsg.second_portal", "Second Portal"],
  ["rsg.enter_stronghold", "Enter Stronghold"],
  ["rsg.enter_end", "Enter End"],
  ["rsg.credits", "Finish"],
]);

export const lbIdToName = new Map<string, string>([
  ["daily", "Daily"],
  ["weekly", "Weekly"],
  ["monthly", "Monthly"],
  ["all", "All Time"],
  ["current", "Trophy - Current"],
  ["season-1", "Trophy - Season 1"],
  ["season-2", "Trophy - Season 2"],
  ["season-3", "Trophy - Season 3"],
  ["season-4", "Trophy - Season 4"],
]);

export const statsDaysToName = new Map<number, string>([
  [1, "Daily"],
  [7, "Weekly"],
  [30, "Monthly"],
  [9999, "All Time"],
]);

export const statsCategoryToName = new Map<string, string>([
  ["nether", "Nether Enters"],
  ["bastion", "Bastion Enters"],
  ["fortress", "Fortress Enters"],
  ["first_structure", "Structure 1 Enters"],
  ["second_structure", "Structure 2 Enters"],
  ["first_portal", "First Portals"],
  ["second_portal", "Second Portals"],
  ["stronghold", "Stronghold Enters"],
  ["end", "End Enters"],
  ["finish", "Completions"],
]);

export const statsTypeToName = new Map<string, string>([
  ["count", "Count"],
  ["average", "Average"],
  ["fastest", "Time"],
  ["conversion", "Conversions"],
]);

export const getMostRecentSplit = (eventList: { eventId: string; igt: number }[]) => {
  const mostRecentEvent = eventList[eventList.length - 1];
  return {
    eventName: eventIdToName.get(mostRecentEvent.eventId) || "Unknown Event",
    igt: msToTime(mostRecentEvent.igt),
  };
};

export const getSortedEventsWithTimes = (completedEvents: Map<string, number>): EventWithTime[] => {
  const bastionTime = completedEvents.get("Enter Bastion");
  const fortressTime = completedEvents.get("Enter Fortress");

  let bastionAndFortress: EventWithTime[] = [];
  if (bastionTime !== undefined) {
    bastionAndFortress.push({ splitName: "Enter Bastion", splitTime: bastionTime });
  } else {
    bastionAndFortress.push({ splitName: "Enter Bastion", splitTime: "N/A" });
  }
  if (fortressTime !== undefined) {
    bastionAndFortress.push({ splitName: "Enter Fortress", splitTime: fortressTime });
  } else {
    bastionAndFortress.push({ splitName: "Enter Fortress", splitTime: "N/A" });
  }

  bastionAndFortress.sort((a, b) => {
    if (a.splitTime === "N/A") return 1;
    if (b.splitTime === "N/A") return -1;
    return (a.splitTime as number) - (b.splitTime as number);
  });

  const sortedEvents: EventWithTime[] = EVENT_ID_NAME.map((splitName) => {
    if (splitName === "Enter Bastion" || splitName === "Enter Fortress") {
      return null;
    }
    const splitTime = completedEvents.get(splitName);
    return { splitName, splitTime: splitTime !== undefined ? splitTime : "N/A" };
  }).filter((event): event is EventWithTime => event !== null);

  const enterNetherIndex = sortedEvents.findIndex((event) => event.splitName === "Enter Nether");
  sortedEvents.splice(enterNetherIndex + 1, 0, ...bastionAndFortress);

  return sortedEvents;
};
