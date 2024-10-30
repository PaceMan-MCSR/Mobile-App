import { View, Text } from "react-native";
import React from "react";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Colors } from "@/constants/Colors";

interface TrophyPickerProps {
  values: Array<string>;
  season: number;
  onChange: () => void;
}

const TrophyPicker = ({ season, onChange }: TrophyPickerProps) => {
  return (
    <View className="px-4 pb-4">
      <SegmentedControl
        values={["Current", "Season 1", "Season 2"]}
        backgroundColor={Colors.dark.background}
        tintColor="#111827"
        selectedIndex={season}
        onChange={onChange}
      />
    </View>
  );
};

export default TrophyPicker;
