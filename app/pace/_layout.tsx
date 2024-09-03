import { Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { EVENT_ID_NAME, msToTime } from "@/lib/utils/frontendConverters";
export default function RootLayout() {
  const { id, eventList, nickname, lastUpdated } = useLocalSearchParams();
  const parsedEventList = JSON.parse(Array.isArray(eventList) ? eventList[0] : eventList);
  const currentEvent = EVENT_ID_NAME[parsedEventList.length - 1];
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: `${nickname} - ${currentEvent} [${msToTime(parseInt(lastUpdated.toString()))}]`,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
