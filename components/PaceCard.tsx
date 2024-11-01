import { Pace } from "@/lib/types/Pace";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { msToTime } from "@/lib/utils/frontendConverters";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "@/components/AnimatedComponents";

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
          placeholder={require("@/assets/images/steve.png")}
        />
      </View>
      <View className="flex flex-1">
        <View className="flex flex-row items-center gap-2">
          <Text className="text-black dark:text-white text-2xl font-bold max-w-full truncate">{nickname}</Text>
          {twitch && <FontAwesome5 name="twitch" size={16} color="white" />}
        </View>
        <Text className="text-black dark:text-white">{splitName}</Text>
      </View>
      <Text className="text-black dark:text-white text-4xl font-bold">{msToTime(time)}</Text>
    </TouchableOpacity>
  );
};

export default PaceCard;
