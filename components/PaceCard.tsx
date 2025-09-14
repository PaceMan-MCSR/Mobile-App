import { useColorsForUI } from "@/hooks/useColorsForUI";
import { Pace } from "@/lib/types/Pace";
import { msToTime } from "@/lib/utils/frontendConverters";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
interface PaceCardProps extends Pace {
  onPress: () => void;
}

const PaceCard = ({ splitName, nickname, uuid, twitch, time, onPress }: PaceCardProps) => {
  const { tintColor } = useColorsForUI();
  return (
    <TouchableOpacity
      className="flex w-full flex-row items-center gap-4 rounded-xl bg-[#DBDEE3] px-4 py-7 dark:bg-[#1F2937]"
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
          <Text numberOfLines={1} className="max-w-full truncate text-2xl font-bold text-black dark:text-white">
            {nickname}{" "}
          </Text>
          {twitch && <FontAwesome6 name="display" size={16} color={tintColor} />}
        </View>
        <Text className="text-black dark:text-white">{splitName}</Text>
      </View>
      <Text className="text-4xl font-bold text-black dark:text-white">{msToTime(time)}</Text>
    </TouchableOpacity>
  );
};

export default PaceCard;
