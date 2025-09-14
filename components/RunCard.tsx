import { msToDate, msToTime } from "@/lib/utils/frontendConverters";
import { Text, View } from "react-native";

interface RunCardProps {
  index: number;
  submitted: number;
  time: number;
}

// For some reason this function doesn't work when declared in frontendConverters
const getRankColor = (index: number) => {
  if (index === 0) return `text-[#daa520] italic`;
  if (index === 1) return `text-[#929292] italic`;
  if (index === 2) return `text-[#cd7f32] italic`;
  return `text-black dark:text-[#ECEDEE]`;
};

const RunCard = ({ index, submitted, time }: RunCardProps) => {
  return (
    <View className="flex w-full flex-row items-center px-4 pb-6">
      <Text className={`flex min-w-10 ${getRankColor(index)} text-xl font-bold`}>{index + 1}</Text>
      <Text className={`flex flex-1 ${getRankColor(index)} text-xl font-bold`}>{msToTime(time)}</Text>
      <Text className={`${getRankColor(index)} text-xl font-bold`}>{msToDate(submitted)}</Text>
    </View>
  );
};

export default RunCard;
