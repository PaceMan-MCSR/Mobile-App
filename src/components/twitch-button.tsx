import { formatDurationForTwitchVodOffset } from "@/lib/utils/frontend-converters";
import { Linking, Text, TouchableOpacity } from "react-native";

interface TwitchButtonProps {
  twitch: string | null;
  vodId?: number | null;
  vodOffset?: number | null;
}

const TwitchButton = ({ twitch, vodId, vodOffset }: TwitchButtonProps) => {
  if (!twitch) return null;

  const isVod = !!vodId && !!vodOffset;

  const getTwitchUrl = () => {
    if (isVod) {
      return `https://www.twitch.tv/videos/${vodId}?t=${formatDurationForTwitchVodOffset(vodOffset!)}`;
    }
    return `https://twitch.tv/${twitch}`;
  };

  const handlePress = () => {
    const twitchUrl = getTwitchUrl();
    Linking.openURL(twitchUrl);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={handlePress}
      className={`flex flex-row items-center gap-2 rounded-xl bg-[#9146FF] p-3`}
    >
      <Text numberOfLines={1} className="text-lg font-bold text-white">
        {`${twitch}${isVod ? " (VOD)" : ""}`}
      </Text>
    </TouchableOpacity>
  );
};

export default TwitchButton;
