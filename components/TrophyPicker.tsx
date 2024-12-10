import { View } from "react-native";
import React from "react";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface TrophyPickerProps {
  values: Array<string>;
  season: number;
  onChange: () => void;
}

const TrophyPicker = ({ season, onChange }: TrophyPickerProps) => {
  const colorScheme = useColorScheme();
  return (
    <View className="p-4">
      <SegmentedControl
        values={["Current", "Season 1", "Season 2"]}
        tintColor={Colors[colorScheme ?? "light"].pickerTint}
        selectedIndex={season}
        onChange={onChange}
      />
    </View>
  );
};

export default TrophyPicker;
