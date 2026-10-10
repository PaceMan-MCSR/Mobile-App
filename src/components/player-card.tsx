import { msToTime } from "@/lib/utils/frontend-converters";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// TODO: Fix this type declaration
interface PlayerCardProps {
  type: "leaderboard" | "trophy" | "search" | "count" | "average" | "fastest" | "conversion";
  index?: number;
  uuid: string;
  nickname: string;
  score?: number;
  time?: number;
  route?: string;
}

const PlayerCard = ({ type = "leaderboard", index, uuid, nickname, score, time, route }: PlayerCardProps) => {
  const getRankColor = (index: number) => {
    if (index === 0) return `text-[#daa520] italic`;
    if (index === 1) return `text-[#929292] italic`;
    if (index === 2) return `text-[#cd7f32] italic`;
    return `text-black dark:text-[#ECEDEE]`;
  };

  const defaultRoute = `/stats/player/${nickname}`;
  const href = route || defaultRoute;

  return (
    <Link href={href} push asChild>
      <TouchableOpacity activeOpacity={0.5} className="flex w-full flex-row items-center gap-3">
        {/* RANK || POINTS  */}
        {type !== "search" && (
          <View className="flex min-w-10">
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
