/* 
Handler to get the appropriate Integrity Headers for App Attest.
Required values are passed as headers to the backend.
*/
import { waitForAndroidIntegrityTokenProviderToBeReady } from "@/providers/notifications/helpers/android-integrity-provider";
import { getChallenge } from "@/providers/notifications/helpers/get-challenge";
import {
  attestKeyAsync,
  generateAssertionAsync,
  generateKeyAsync,
  requestIntegrityCheckAsync,
} from "@expo/app-integrity";
import { Buffer } from "buffer";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { Platform } from "react-native";

export const getIntegrityHeaders = async (expoToken: string, deviceToken: string): Promise<Record<string, string>> => {
  if (Platform.OS !== "android" && Platform.OS !== "ios") return {};

  const challenge = await getChallenge(expoToken);

  if (Platform.OS === "android") {
    // Wait for integrity token provider to be prepared before requesting integrity check
    await waitForAndroidIntegrityTokenProviderToBeReady();
    const integrityToken = await requestIntegrityCheckAsync(challenge);
    return {
      "Content-Type": "application/json",
      "x-platform": Platform.OS,
      "x-expo-token": expoToken,
      "x-device-token": deviceToken,
      "x-challenge": challenge,
      "x-integrity-token": integrityToken,
    };
  }
  if (Platform.OS === "ios") {
    let keyId = await getItemAsync("app-attest-key");

    // Validate challenge and expoToken
    if (!challenge || typeof challenge !== "string" || challenge.trim().length === 0) {
      throw new Error("Invalid challenge received from server");
    }

    if (!expoToken || typeof expoToken !== "string" || expoToken.trim().length === 0) {
      throw new Error("Invalid expoToken provided");
    }

    // If no key exists, generate and attest a new one
    if (!keyId || typeof keyId !== "string" || keyId.trim().length === 0) {
      keyId = await generateKeyAsync();
      await setItemAsync("app-attest-key", keyId);
      const attestation = await attestKeyAsync(keyId, challenge);
      return {
        "Content-Type": "application/json",
        "x-platform": Platform.OS,
        "x-expo-token": expoToken,
        "x-device-token": deviceToken,
        "x-challenge": challenge,
        "x-key-id": keyId,
        "x-attestation": attestation,
      };
    }

    // Try to generate assertion with existing key for authentication
    // Assertion is used when token already exists - proves device identity without re-attestation
    try {
      const request = {
        expoToken,
        challenge,
      };

      const assertion = await generateAssertionAsync(keyId, JSON.stringify(request));
      const rawAuthentication = JSON.stringify({
        keyId,
        assertion,
      });

      const authentication = Buffer.from(rawAuthentication).toString("base64");

      return {
        "Content-Type": "application/json",
        "x-platform": Platform.OS,
        "x-expo-token": expoToken,
        "x-device-token": deviceToken,
        "x-challenge": challenge,
        "x-key-id": keyId,
        "x-authentication": authentication,
        "x-assertion-payload": JSON.stringify(request),
      };
    } catch {
      // Assertion failed (likely due to app reinstall or key invalidation), fall back to attestation
      // This happens when the existing key is no longer valid - need to generate and attest a new one

      // Clear invalid key
      try {
        await deleteItemAsync("app-attest-key");
      } catch {}

      // Generate new key and attest it
      const newKeyId = await generateKeyAsync();
      await setItemAsync("app-attest-key", newKeyId);
      const attestation = await attestKeyAsync(newKeyId, challenge);

      return {
        "Content-Type": "application/json",
        "x-platform": Platform.OS,
        "x-expo-token": expoToken,
        "x-device-token": deviceToken,
        "x-challenge": challenge,
        "x-key-id": newKeyId,
        "x-attestation": attestation,
      };
    }
  }
  return {};
};
