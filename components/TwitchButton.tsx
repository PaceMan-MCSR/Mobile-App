import React from "react";
import { Text, Touchable, TouchableOpacity, Linking } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";

interface TwitchButtonProps {
  href: string;
}

const TwitchButton = ({ href }: TwitchButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={href === null}
      onPress={() => {
        href !== null && Linking.openURL(`https://twitch.tv/${href}`);
      }}
      className={`flex flex-row items-center p-3 gap-2 rounded-xl ${href !== null ? `bg-[#9146FF]` : `bg-gray-500`}`}
    >
      {href !== null && <FontAwesome5 name="twitch" size={24} color="white" />}
      <Text className="text-white font-bold text-lg">{href || "Offline Run"}</Text>
    </TouchableOpacity>
  );
};

export default TwitchButton;
