const getAppName = () => {
  if (process.env.APP_VARIANT === "production") return "PaceMan.gg";
  if (process.env.APP_VARIANT === "development") return "PaceMan.gg (Dev)";
  if (process.env.APP_VARIANT === "preview") return "PaceMan.gg (Preview)";
};

const getBundleIdentifier = () => {
  if (process.env.APP_VARIANT === "production") return "com.chitrakshtarun.pacemangg";
  if (process.env.APP_VARIANT === "development") return "com.chitrakshtarun.pacemangg.dev";
  if (process.env.APP_VARIANT === "preview") return "com.chitrakshtarun.pacemangg.preview";
};

const appName = getAppName();
const bundleIdentifier = getBundleIdentifier();

export default {
  expo: {
    name: appName,
    slug: "PaceManGG",
    version: "1.0.0",
    orientation: "portrait",
    newArchEnabled: true,
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: bundleIdentifier,
      icon: {
        light: "./assets/images/icon.png",
        dark: "./assets/images/icon-dark.png",
        tinted: "./assets/images/icon-tinted.png",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: bundleIdentifier,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-font",
      "react-native-bottom-tabs",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            deploymentTarget: "15.1",
          },
        },
      ],
      [
        "expo-splash-screen",
        {
          backgroundColor: "#1f2937",
          image: "./assets/images/splash.png",
          imageWidth: 180,
        },
      ],
      [
        "react-native-edge-to-edge",
        {
          android: {
            enforceNavigationBarContrast: false,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "a486e969-0d5d-4d6c-9b52-cb68339cdf41",
      },
    },
  },
};
