import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: "http://192.168.1.8:4005",
  plugins: [
    expoClient({
      scheme: "chat",
      storagePrefix: "chat",
      storage: SecureStore,
    }),
  ],
});

const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
};
