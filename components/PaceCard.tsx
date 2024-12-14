import { Pace } from "@/lib/types/Pace";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import { msToTime } from "@/lib/utils/frontendConverters";
import { FontAwesome6 } from "@expo/vector-icons";

interface PaceCardProps extends Pace {
  onPress: () => void;
}

const PaceCard = ({ splitName, nickname, uuid, twitch, time, onPress }: PaceCardProps) => {
  return (
    <TouchableOpacity
      className="flex flex-row w-full items-center h-28 px-4 my-2 gap-4 rounded-xl bg-gray-300 dark:bg-[#1f2937]"
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View>
        <Image
          source={`https://mc-heads.net/avatar/${uuid}`}
          style={{ height: 50, width: 50 }}
          placeholder={require("@/assets/images/placeholder.png")}
        />
      </View>
      <View className="flex flex-1 pr-3">
        <View className="flex flex-row items-center">
          <Text numberOfLines={1} className="text-black dark:text-white text-2xl font-bold max-w-full truncate">
            {nickname}{" "}
          </Text>
          {twitch && <FontAwesome6 name="display" size={16} color="white" />}
        </View>
        <Text className="text-black dark:text-white">{splitName}</Text>
      </View>
      <Text className="text-black dark:text-white text-4xl font-bold">{msToTime(time)}</Text>
    </TouchableOpacity>
  );
};

export default PaceCard;
