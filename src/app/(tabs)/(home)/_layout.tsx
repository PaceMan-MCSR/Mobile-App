import { useScreenOptions } from "@/hooks/use-screen-options";
import { SelectedPaceProvider } from "@/providers/selected-pace";
import { Stack } from "expo-router";

export default function HomeLayout() {
  const screenOptions = useScreenOptions();
  return (
    <SelectedPaceProvider>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "PaceMan.gg",
          }}
        />
      </Stack>
    </SelectedPaceProvider>
  );
}
