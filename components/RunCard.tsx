import React from "react";
import { Text, View } from "react-native";
import { msToTime, msToDate } from "@/lib/utils/frontendConverters";

interface RunCardProps {
  index: number;
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

const RunCard = ({ index, submitted, time }: RunCardProps) => {
  return (
    <View className="flex flex-row w-full items-center px-4 pb-6">
      <Text className={`flex min-w-10 ${getRankColor(index)} text-xl font-bold`}>{index + 1}</Text>
      <Text className={`flex flex-1 ${getRankColor(index)} text-xl font-bold`}>{msToTime(time)}</Text>
      <Text className={`${getRankColor(index)} text-xl font-bold`}>{msToDate(submitted)}</Text>
    </View>
  );
};

export default RunCard;
