import { Text, TouchableOpacity, Linking } from "react-native";

const TwitchButton = ({ href }: { href: string }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        Linking.openURL(`https://twitch.tv/${href}`);
      }}
      className={`flex flex-row items-center p-3 gap-2 rounded-xl bg-[${`#9146FF`}]`}
    >
      <Text numberOfLines={1} className="text-white text-lg font-bold">
        {href ?? "Stream"}
      </Text>
    </TouchableOpacity>
  );
};

export default TwitchButton;
