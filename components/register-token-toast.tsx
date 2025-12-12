import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { Ionicons } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import { useColorScheme } from "nativewind";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface RegisterTokenToastProps {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const RegisterTokenToast = ({ isPending, isSuccess, isError }: RegisterTokenToastProps) => {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";
  const translateY = useSharedValue(-200); // Start off-screen at top
  const opacity = useSharedValue(0); // Start invisible
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  const textColor = isDark ? "#ECEDEE" : "#000000";
  const { backgroundColor } = useColorsForUI();

  const hideToast = () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
    translateY.value = withSpring(-200, { damping: 15, stiffness: 200 });
    opacity.value = withTiming(0, { duration: 150 });
    // After animation completes, stop rendering
    setTimeout(() => {
      setShouldRender(false);
    }, 200);
  };

  useEffect(() => {
    if (isPending) {
      // Show toast when mutation starts (including retries after integrity errors)
      setShouldRender(true);
      translateY.value = -200;
      opacity.value = 0;
      translateY.value = withSpring(0, { damping: 50, stiffness: 400 });
      opacity.value = withTiming(1, { duration: 120 });

      // Clear any existing timer
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
        autoHideTimerRef.current = null;
      }
    } else if (isSuccess && shouldRender) {
      // On success, change to success message and auto-dismiss after 3 seconds
      // Only set timer if we're already rendering (to handle retry success case)
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }
      autoHideTimerRef.current = setTimeout(() => {
        hideToast();
      }, 3000) as unknown as NodeJS.Timeout;
    } else if (isError && shouldRender) {
      // On error, immediately dismiss (but only if we're currently showing)
      hideToast();
    }

    return () => {
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
        autoHideTimerRef.current = null;
      }
    };
  }, [isPending, isSuccess, isError, shouldRender]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const topOffset = insets.top + 16;

  // Don't render if we shouldn't render or if not pending/success
  if (!shouldRender || (!isPending && !isSuccess)) {
    return null;
  }

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          top: topOffset,
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
            flex: 1,
            fontSize: 16,
            color: textColor,
            fontWeight: "400",
          }}
        >
          {isSuccess ? "Notifications set up!" : "Setting up Notifications"}
        </Text>
        {isPending ? (
          <ActivityIndicator size="small" color={textColor} style={{ marginLeft: 12 }} />
        ) : isSuccess ? (
          Platform.OS === "ios" ? (
            <SymbolView name="checkmark.circle.fill" size={20} tintColor={textColor} style={{ marginLeft: 12 }} />
          ) : (
            <Ionicons name="checkmark-circle" size={20} color={textColor} style={{ marginLeft: 12 }} />
          )
        ) : null}
      </View>
    </Animated.View>
  );
};

export default RegisterTokenToast;
