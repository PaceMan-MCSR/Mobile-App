import { Image } from "expo-image";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useRef, useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface NotificationsToastOptions {
  nickname: string;
  split: string;
  worldId: string;
  twitch?: string;
  duration?: number;
}

let toastState: {
  show: (options: NotificationsToastOptions) => void;
  hide: () => void;
} = {
  show: () => {},
  hide: () => {},
};

const NotificationsToastComponent = () => {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";
  const [options, setOptions] = useState<NotificationsToastOptions | null>(null);
  const translateY = useSharedValue(-200); // Start off-screen at top
  const opacity = useSharedValue(0); // Start invisible
  const startY = useSharedValue(0);
  const setOptionsRef = useRef(setOptions);
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep ref updated
  useEffect(() => {
    setOptionsRef.current = setOptions;
  }, []);

  const hideToast = useCallback(() => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
    translateY.value = withSpring(-200, { damping: 15, stiffness: 200 });
    opacity.value = withTiming(0, { duration: 150 });
    setTimeout(() => {
      setOptionsRef.current(null);
    }, 200);
  }, [translateY, opacity]);

  useEffect(() => {
    toastState.show = (newOptions: NotificationsToastOptions) => {
      setOptionsRef.current(newOptions);
    };
    toastState.hide = hideToast;
  }, [hideToast]);

  useEffect(() => {
    if (options) {
      translateY.value = -200;
      opacity.value = 0;

      // Animate in from top
      translateY.value = withSpring(0, { damping: 50, stiffness: 400 });
      opacity.value = withTiming(1, { duration: 120 });

      // Auto-hide after duration (default 5 seconds)
      const duration = options.duration ?? 5000;
      autoHideTimerRef.current = setTimeout(() => {
        hideToast();
      }, duration) as unknown as NodeJS.Timeout;

      return () => {
        if (autoHideTimerRef.current) {
          clearTimeout(autoHideTimerRef.current);
          autoHideTimerRef.current = null;
        }
      };
    }
  }, [options]);

  // Swipe up gesture
  const panGesture = Gesture.Pan()
    .onStart((_) => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      // Only allow swiping up (negative translation)
      if (event.translationY < 0) {
        translateY.value = startY.value + event.translationY;
        // Fade out as you swipe up
        const progress = Math.abs(event.translationY) / 100;
        opacity.value = Math.max(0, 1 - progress);
      }
    })
    .onEnd((event) => {
      // If swiped up more than 50px, dismiss
      if (event.translationY < -50 || event.velocityY < -500) {
        runOnJS(hideToast)();
      } else {
        // Spring back to original position
        translateY.value = withSpring(0, { damping: 50, stiffness: 400 });
        opacity.value = withTiming(1, { duration: 120 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const topOffset = insets.top + 16;

  const backgroundColor = isDark ? "#1F2937" : "#FFFFFF";
  const textColor = isDark ? "#ECEDEE" : "#000000";

  if (!options) {
    return null;
  }

  const handleViewPress = () => {
    router.push(`/stats/run/${options.worldId}?searchQueriedNickname=${options.nickname}` as any);
    hideToast();
  };

  const handleWatchPress = () => {
    if (options.twitch) {
      Linking.openURL(`https://twitch.tv/${options.twitch}`);
    }
    hideToast();
  };

  return (
    <GestureDetector gesture={panGesture}>
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
            paddingHorizontal: 16,
          },
        ]}
      >
        <View
          style={{
            backgroundColor,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "flex-start",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
            width: "100%",
          }}
        >
          <View style={{ marginRight: 12 }}>
            <Image
              source={`https://mc-heads.net/avatar/${options.nickname}`}
              style={{ height: 56, width: 56, borderRadius: 8 }}
              placeholder={require("@/assets/images/placeholder.png")}
              contentFit="cover"
            />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
              <Text
                className="text-2xl font-bold"
                style={{
                  flex: 1,
                  color: textColor,
                  marginRight: 8,
                }}
                numberOfLines={1}
              >
                {options.nickname}
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable
                  onPress={handleViewPress}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: isDark ? "#374151" : "#E5E7EB",
                    minWidth: 60,
                    minHeight: 32,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: textColor,
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    Info
                  </Text>
                </Pressable>
                {options.twitch && (
                  <Pressable
                    onPress={handleWatchPress}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 6,
                      borderRadius: 999,
                      backgroundColor: "#9146FF",
                      minWidth: 60,
                      minHeight: 32,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: textColor,
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      Watch
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
            <Text
              style={{
                fontSize: 14,
                color: textColor,
                fontWeight: "400",
                opacity: 0.8,
              }}
              numberOfLines={2}
            >
              {options.split}
            </Text>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export const paceNotificationToast = (options: NotificationsToastOptions) => {
  toastState.show(options);
};

export default NotificationsToastComponent;
