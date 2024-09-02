import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const PacePage = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text style={{ color: "white" }}>{id}</Text>
    </View>
  );
};

export default PacePage;
