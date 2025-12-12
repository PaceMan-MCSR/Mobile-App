import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { ActivityIndicator, Platform, Pressable, Text, View } from "react-native";
import { useBottomTabBarHeight } from "react-native-bottom-tabs";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface NotificationsSaveCardActionButton {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export interface NotificationsSaveCardProps {
  message: string;
  actionButtons?: NotificationsSaveCardActionButton[];
  visible?: boolean;
}

const NotificationsSaveCard = ({ message, actionButtons, visible = true }: NotificationsSaveCardProps) => {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";
  const translateY = useSharedValue(100); // Start off-screen
  const opacity = useSharedValue(0); // Start invisible

  useEffect(() => {
    if (visible) {
      // Animate in - faster appearance, less bouncy
      translateY.value = withSpring(0, { damping: 50, stiffness: 400 });
      opacity.value = withTiming(1, { duration: 120 });
    } else {
      // Animate out with spring
      translateY.value = withSpring(100, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  // Tab bar is typically ~49px + safe area bottom
  const tabBarHeight = useBottomTabBarHeight();
  const bottomOffset = Platform.select({
    ios: tabBarHeight + insets.bottom / 2,
    android: insets.bottom,
  });

  const textColor = isDark ? "#ECEDEE" : "#000000";
  const { backgroundColor } = useColorsForUI();

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          bottom: bottomOffset,
          left: 0,
          right: 0,
          zIndex: 1000,
          alignItems: "center",
          paddingHorizontal: 20,
        },
      ]}
    >
      <View
        style={{
          backgroundColor,
          borderRadius: 999, // Pill shape
          paddingHorizontal: 20,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          minHeight: 44,
        }}
      >
        <Text
          style={{
            flex: actionButtons && actionButtons.length > 0 ? 1 : 0,
            fontSize: 16,
            color: textColor,
            fontWeight: "400",
          }}
        >
          {message}
        </Text>
        {actionButtons && actionButtons.length > 0 && (
          <View style={{ flexDirection: "row", marginLeft: 12, gap: 8 }}>
            {actionButtons.map((actionButton, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  if (!actionButton.loading) {
                    actionButton.onPress();
                  }
                }}
                disabled={actionButton.loading}
              >
                <View
                  style={{
                    backgroundColor: actionButton.variant === "primary" ? "#00AA00" : isDark ? "#374151" : "#E5E7EB",
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 999,
                    minWidth: 60,
                    minHeight: 32,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {actionButton.loading ? (
                    <ActivityIndicator
                      size="small"
                      color={actionButton.variant === "primary" ? "#FFFFFF" : textColor}
                    />
                  ) : (
                    <Text
                      style={{
                        color: actionButton.variant === "primary" ? "#FFFFFF" : textColor,
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      {actionButton.label}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default NotificationsSaveCard;
