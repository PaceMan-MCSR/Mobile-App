import { memo } from "react";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { msToTime } from "@/lib/utils/frontendConverters";
import { View, Text, TouchableOpacity } from "react-native";

interface PlayerCardProps {
  type: "leaderboard" | "trophy" | "player" | "search" | "count" | "average" | "fastest" | "conversion";
  index?: number;
  uuid: string;
  nickname: string;
  score?: number;
  time?: number;
}

const PlayerCard = ({ type = "leaderboard", index, uuid, nickname, score, time }: PlayerCardProps) => {
  // For some reason this function doesn't work when declared in frontendConverters
  const getRankColor = (index: number) => {
    if (index === 0) return `text-[#daa520] italic`;
    if (index === 1) return `text-[#929292] italic`;
    if (index === 2) return `text-[#cd7f32] italic`;
    return `text-black dark:text-[#ECEDEE]`;
  };

  return (
    <Link href={`/stats/player/${nickname}`} push asChild>
      <TouchableOpacity activeOpacity={0.5} className="flex flex-row w-full items-center gap-3">
        {/* RANK || POINTS  */}
        {type !== "search" && (
          <View className="min-w-10 flex">
            <Text className={`text-xl font-bold ${getRankColor(index!)}`}>{index! + 1}</Text>
          </View>
        )}

        {/* PLAYER AVATAR */}
        <Image
          source={`https://mc-heads.net/avatar/${uuid}`}
          style={{ height: 35, width: 35 }}
          placeholder={require("@/assets/images/placeholder.png")}
        />
        {/* PLAYER NAME */}
        <Text numberOfLines={1} className={`flex flex-1 text-xl font-bold ${getRankColor(index!)}`}>
          {nickname}
        </Text>
        {/* TIMESTAMP (PB | SPLIT TIME) */}
        {type !== "search" && (
          <Text className={`text-xl font-bold ${getRankColor(index!)}`}>
            {type === "count" && `${score}`}
            {type === "trophy" && `${score} pts`}
            {type === "conversion" && `${score?.toPrecision(4)}%`}
            {(type === "leaderboard" || type === "fastest" || type === "average") && msToTime(time!)}
          </Text>
        )}
      </TouchableOpacity>
    </Link>
  );
};

export default memo(PlayerCard);
