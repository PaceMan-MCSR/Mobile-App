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

const getGoogleServicesFile = () => {
  if (process.env.APP_VARIANT === "production") return "./.google-services/production.json";
  if (process.env.APP_VARIANT === "development") return "./.google-services/development.json";
  if (process.env.APP_VARIANT === "preview") return "./.google-services/preview.json";
};

const getIOSIcon = () => {
  if (process.env.APP_VARIANT === "production") return "./assets/icons/ios/production.icon";
  if (process.env.APP_VARIANT === "development") return "./assets/icons/ios/development.icon";
  if (process.env.APP_VARIANT === "preview") return "./assets/icons/ios/preview.icon";
};

const getAndroidIcon = () => {
  if (process.env.APP_VARIANT === "production") return "./assets/icons/android/production.png";
  if (process.env.APP_VARIANT === "development") return "./assets/icons/android/development.png";
  if (process.env.APP_VARIANT === "preview") return "./assets/icons/android/preview.png";
};

const appName = getAppName();
const bundleIdentifier = getBundleIdentifier();
const googleServicesFile = getGoogleServicesFile();
const iOSIcon = getIOSIcon();
const androidIcon = getAndroidIcon();

export default {
  expo: {
    name: appName,
    slug: "PaceManGG",
    version: "1.2.0",
    orientation: "portrait",
    newArchEnabled: true,
    icon: "./assets/icons/icon.png",
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
      config: {
        usesNonExemptEncryption: false,
      },
      icon: iOSIcon,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: androidIcon,
        backgroundColor: "#ffffff",
      },
      package: bundleIdentifier,
      googleServicesFile: googleServicesFile,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/icons/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-notifications",
      "expo-secure-store",
      "expo-web-browser",
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
