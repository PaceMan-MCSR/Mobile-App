import { formatDurationForTwitchVodOffset } from "@/lib/utils/frontend-converters";
import { Button, Host } from "@expo/ui/swift-ui";
import { buttonStyle, tint } from "@expo/ui/swift-ui/modifiers";
import { Linking } from "react-native";
import type { TwitchButtonProps } from "./types";

const TwitchButton = ({ twitch, vodId, vodOffset }: TwitchButtonProps) => {
  if (!twitch) return null;

  const isVod = !!vodId && !!vodOffset;
  const label = `${twitch} ${isVod ? "(VOD)" : ""}`;

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
      <Button onPress={handlePress} label={label} modifiers={[buttonStyle("glassProminent"), tint("#9146FF")]} />
    </Host>
  );
};

export default TwitchButton;
