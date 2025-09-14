import { Linking, Text, TouchableOpacity } from "react-native";

const TwitchButton = ({ href }: { href: string }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        Linking.openURL(`https://twitch.tv/${href}`);
      }}
      className={`flex flex-row items-center gap-2 rounded-xl bg-[#9146FF] p-3`}
    >
      <Text numberOfLines={1} className="text-lg font-bold text-white">
        {href ?? "Stream"}
      </Text>
    </TouchableOpacity>
  );
};

export default TwitchButton;
