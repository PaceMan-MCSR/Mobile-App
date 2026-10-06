import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";

import type { ContextMenuProps } from "./types";

export default function ContextMenu<T extends string | number>({
  trigger,
  options,
  selectedValue,
  onSelect,
}: ContextMenuProps<T>) {
  const [visible, setVisible] = useState(false);
  const isDark = useColorScheme() === "dark";

  return (
    <>
      <Pressable accessibilityRole="button" onPress={() => setVisible(true)}>
        {trigger}
      </Pressable>
      <Modal transparent animationType="fade" visible={visible} onRequestClose={() => setVisible(false)}>
        <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
          <Pressable
            accessibilityLabel="Dismiss menu"
            onPress={() => setVisible(false)}
            style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 0, 0, 0.35)" }}
          />
          <ScrollView style={{ maxHeight: "80%", borderRadius: 12, backgroundColor: isDark ? "#1F2937" : "white" }}>
            {options.map((option) => (
              <Pressable
                key={String(option.value)}
                onPress={() => {
                  onSelect(option.value);
                  setVisible(false);
                }}
                style={{ minHeight: 48, flexDirection: "row", alignItems: "center", paddingHorizontal: 16 }}
              >
                <Text style={{ flex: 1, color: isDark ? "#ECEDEE" : "black" }}>{option.label}</Text>
                {selectedValue === option.value && <Text style={{ color: isDark ? "#ECEDEE" : "black" }}>✓</Text>}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
