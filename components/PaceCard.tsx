import React, { useEffect } from "react";
import { Pace } from "@/lib/types/Pace";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EVENT_ID_NAME, msToTime } from "@/lib/utils/frontendConverters";

const PaceCard = (props: Pace) => {
  const router = useRouter();
  const handlePress = () => {
    router.push(`/pace/${props.worldId}`);
  };
  const handleLongPress = () => {
    console.log("peepoPauseMan");
  };

  const splitTime = msToTime(props.lastUpdated);
  const currentEvent = EVENT_ID_NAME[props.eventList.length - 1];

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.75} onPress={handlePress} onLongPress={handleLongPress}>
      {/* MINECRAFT SKIN AVATAR */}
      <View>
        <Image source={`https://mc-heads.net/avatar/${props.user.uuid}`} style={styles.image} />
      </View>
      {/* USERNAME + CURRENT SPLIT */}
      <View style={styles.eventContainer}>
        <Text style={styles.nicknameText}>{props.nickname}</Text>
        <Text>{currentEvent}</Text>
      </View>
      {/* LAST UPDATED */}
      <Text style={styles.timeText}>{splitTime}</Text>
    </TouchableOpacity>
  );
};
export default PaceCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF0000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 16,
    marginVertical: 8,
  },
  image: {
    height: 50,
    width: 50,
  },
  eventContainer: {
    flex: 1,
  },
  nicknameText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
