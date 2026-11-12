import { formatDurationForTwitchVodOffset } from "@/lib/utils/frontend-converters";
import { Host } from "@expo/ui";
import { Button, Text } from "@expo/ui/jetpack-compose";
import { Linking } from "react-native";
import type { TwitchButtonProps } from "./types";

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
    <Host matchContents>
      <Button onClick={handlePress} colors={{ containerColor: "#9146FF", contentColor: "#FFFFFF" }}>
        <Text>{`${twitch}${isVod ? " (VOD)" : ""}`}</Text>
      </Button>
    </Host>
  );
};

export default TwitchButton;
