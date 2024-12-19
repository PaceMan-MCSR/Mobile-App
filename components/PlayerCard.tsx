import { memo } from "react";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { msToTime } from "@/lib/utils/frontendConverters";
import { View, Text, TouchableOpacity } from "react-native";

interface PlayerCardProps {
  type: "leaderboard" | "trophy" | "player" | "search";
  index?: number;
  uuid: string;
  nickname: string;
  score?: number;
  time?: number;
}

const PlayerCard = ({ type = "leaderboard", index, uuid, nickname, score, time }: PlayerCardProps) => {
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

  return (
    <Link href={`/stats/player/${nickname}`} push asChild>
      <TouchableOpacity activeOpacity={0.5} className="flex flex-row w-full items-center px-4 py-4 gap-3">
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
        <Text className={`flex flex-1 text-xl font-bold ${getRankColor(index!)}`}>{nickname}</Text>
        {/* TIMESTAMP (PB | SPLIT TIME) */}
        {type !== "search" && (
          <Text className={`text-xl font-bold ${getRankColor(index!)}`}>
            {type !== "trophy" && msToTime(time!)}
            {type === "trophy" && `${score} pts`}
          </Text>
        )}
      </TouchableOpacity>
    </Link>
  );
};

export default memo(PlayerCard);
