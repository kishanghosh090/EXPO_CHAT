import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: "http://192.168.1.3:4005",
  plugins: [
    expoClient({
      scheme: "chat",
      storagePrefix: "chat",
      storage: SecureStore,
    }),
  ],
});
