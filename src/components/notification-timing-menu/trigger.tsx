import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { SymbolView } from "expo-symbols";
import { Text, View } from "react-native";

export default function NotificationTimingMenuTrigger({ label }: { label: string }) {
  const { tintColor } = useColorsForUI();

  return (
    <View className="flex flex-row items-center gap-1">
      <Text className="text-xl font-semibold text-black dark:text-[#ECEDEE]">{label}</Text>
      <SymbolView
        name={{ ios: "chevron.up.chevron.down", android: "unfold_more", web: "unfold_more" }}
        tintColor={tintColor}
        size={16}
      />
    </View>
  );
}
