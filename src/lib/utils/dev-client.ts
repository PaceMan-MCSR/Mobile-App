// Not using this right now but good to have for reference

import * as DevClient from "expo-dev-client";
import * as SecureStore from "expo-secure-store";

export const devClientItems = () => {
  DevClient.registerDevMenuItems([
    {
      name: "Delete Notification Keys",
      callback: async () => {
        await Promise.all([
          SecureStore.deleteItemAsync("app-attest-key"),
          SecureStore.deleteItemAsync("cached-expo-token"),
          SecureStore.deleteItemAsync("cached-device-token"),
        ]);
      },
      shouldCollapse: true,
    },
    {
      name: "Set Test Cache Values",
      callback: async () => {
        await Promise.all([
          SecureStore.setItemAsync("cached-expo-token", "ExponentPushToken[test]"),
          SecureStore.setItemAsync("cached-device-token", "abcd"),
        ]);
      },
      shouldCollapse: true,
    },
  ]);
};
