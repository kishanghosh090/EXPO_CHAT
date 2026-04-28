import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { expo } from "@better-auth/expo";

export const auth = betterAuth({
  plugins: [expo()],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account",

      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: [
    "chat://",
    ...(process.env.NODE_ENV != "production"
      ? ["exp://", "exp://**", "exp://192.167.*.*:/**"]
      : []),
  ],
  debug: process.env.NODE_ENV != "production",
  allowDangerousConnection: process.env.NODE_ENV != "production",
});
