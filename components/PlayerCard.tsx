import { memo } from "react";
import { Image } from "expo-image";
import { msToTime } from "@/lib/utils/frontendConverters";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

// Need to fix this, make the types more dynamic to take in info based on if it's leaderboard, player or trophy.
interface PlayerCardProps {
  type: "leaderboard" | "trophy" | "player";
  index: number;
  uuid: string;
  nickname: string;
  score?: number;
  time: number;
}

const PlayerCard = ({ type = "leaderboard", index, uuid, nickname, score, time }: PlayerCardProps) => {
  const router = useRouter();
  const handlePress = () => {
    router.push({
      pathname: `/(tabs)/stats/player/[id]`,
      params: {
        id: nickname,
      },
    });
  };
  const getRankColor = (index: number) => {
    return index === 0
      ? `text-rank-gold italic`
      : index === 1
      ? `text-rank-silver italic`
      : index === 2
      ? `text-rank-bronze italic`
      : `text-black dark:text-white`;
  };
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      className="flex flex-row w-full items-center px-4 py-4 gap-3"
      onPress={handlePress}
    >
      {/* RANK || POINTS  */}
      <View className="min-w-10 flex">
        <Text className={`text-xl font-bold ${getRankColor(index)}`}>{index + 1}</Text>
      </View>

      {/* PLAYER AVATAR */}
      <Image
        source={`https://mc-heads.net/avatar/${uuid}`}
        style={{ height: 35, width: 35 }}
        placeholder={require("@/assets/images/placeholder.png")}
      />
      {/* PLAYER NAME */}
      <Text className={`flex flex-1 text-xl font-bold ${getRankColor(index)}`}>{nickname}</Text>
      {/* TIMESTAMP (PB | SPLIT TIME) */}
      <Text className={`text-xl font-bold ${getRankColor(index)}`}>
        {type !== "trophy" && msToTime(time)}
        {type === "trophy" && `${score} pts`}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(PlayerCard);
