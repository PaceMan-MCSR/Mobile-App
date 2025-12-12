import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

interface NotificationPlayerCardProps {
  uuid: string;
  nickname: string;
  route: string;
}

const NotificationPlayerCard = ({ uuid, nickname, route }: NotificationPlayerCardProps) => {
  const { tintColor } = useColorsForUI();

  return (
    <Link href={route as any} push asChild>
      <TouchableOpacity
        activeOpacity={0.5}
        className="flex flex-row items-center justify-between rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]"
      >
        <View className="flex flex-1 flex-row items-center gap-3">
          {/* PLAYER AVATAR */}
          <Image
            source={`https://mc-heads.net/avatar/${uuid}`}
            style={{ height: 35, width: 35 }}
            placeholder={require("@/assets/images/placeholder.png")}
          />
          {/* PLAYER NAME */}
          <Text numberOfLines={1} className="flex flex-1 text-xl font-bold text-black dark:text-[#ECEDEE]">
            {nickname}
          </Text>
        </View>

        {/* CHEVRON ARROW */}
        {Platform.OS === "ios" && <SymbolView name="chevron.right" size={18} />}
        {Platform.OS === "android" && <MaterialCommunityIcons name="chevron-right" size={24} color={tintColor} />}
      </TouchableOpacity>
    </Link>
  );
};

export default memo(NotificationPlayerCard);
