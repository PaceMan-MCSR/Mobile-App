import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { msToTime, msToDate } from "@/lib/utils/frontendConverters";

interface RunCardProps {
  index: number;
  uuid: string;
  submitted: number;
  time: number;
}

// For some reason this function doesn't work when declared in frontendConverters
const getRankColor = (index: number) => {
  return index === 0
    ? `text-rank-gold italic`
    : index === 1
    ? `text-rank-silver italic`
    : index === 2
    ? `text-rank-bronze italic`
    : `text-text-primary`;
};

const RunCard = ({ index, uuid, submitted, time }: RunCardProps) => {
  return (
    <Link href={`/stats/run/${uuid}`} push asChild>
      <TouchableOpacity activeOpacity={0.5} className="flex flex-row w-full items-center px-4 pb-6">
        <Text className={`flex min-w-10 ${getRankColor(index)} text-xl font-bold`}>{index + 1}</Text>
        <Text className={`flex flex-1 ${getRankColor(index)} text-xl font-bold`}>{msToTime(time)}</Text>
        <Text className={`${getRankColor(index)} text-xl font-bold`}>{msToDate(submitted)}</Text>
      </TouchableOpacity>
    </Link>
  );
};

export default RunCard;
