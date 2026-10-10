/* 
Handler to prepare Play Integrity Token Provider
*/
import { prepareIntegrityTokenProviderAsync } from "@expo/app-integrity";
import { Platform } from "react-native";

let integrityProviderReadyPromise: Promise<void> | null = null;
let integrityProviderReadyResolver: (() => void) | null = null;

export const waitForAndroidIntegrityTokenProviderToBeReady = async (): Promise<void> => {
  if (Platform.OS !== "android") {
    return Promise.resolve();
  }
  if (integrityProviderReadyPromise) {
    return integrityProviderReadyPromise;
  }
  integrityProviderReadyPromise = new Promise((resolve) => {
    integrityProviderReadyResolver = resolve;
  });
  return integrityProviderReadyPromise;
};

export const prepareAndroidIntegrityTokenProvider = async (): Promise<void> => {
  if (Platform.OS !== "android") {
    return;
  }

  const cloudProjectNumber = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_PROJECT_NUMBER;
  if (cloudProjectNumber) {
    if (!integrityProviderReadyPromise) {
      integrityProviderReadyPromise = new Promise((resolve) => {
        integrityProviderReadyResolver = resolve;
      });
    }
    prepareIntegrityTokenProviderAsync(cloudProjectNumber)
      .then(() => {
        if (integrityProviderReadyResolver) {
          integrityProviderReadyResolver();
        }
      })
      .catch(() => {
        if (integrityProviderReadyResolver) {
          integrityProviderReadyResolver();
        }
      });
  } else {
    if (!integrityProviderReadyPromise) {
      integrityProviderReadyPromise = Promise.resolve();
    } else if (integrityProviderReadyResolver) {
      integrityProviderReadyResolver();
    }
  }
};
