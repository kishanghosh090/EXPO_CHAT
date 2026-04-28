import { authClient } from "@/utils/auth-client";
import React from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<null | string>;
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<null | string>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<null | string>;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: false,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
  googleSignIn: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, error, isPending } = authClient.useSession();

  const isLoading = isPending;
  const session = data?.session;
  const token = session?.token ?? null;
  const user: AuthUser | null = data?.user
    ? {
        id: data.user.id!!,
        name: data.user.name!!,
        email: data.user.email!!,
        image: data.user.image ?? null,
      }
    : null;

  const signIn = async (
    email: string,
    password: string,
  ): Promise<null | string> => {
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message || "An error occurred during sign-in");
      }
      // Handle successful sign-in, e.g., set user state
      return null;
    } catch (error) {
      throw new Error(
        (error as Error).message || "An error occurred during sign-in",
      );
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
  ): Promise<null | string> => {
    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });
      if (error) {
        throw new Error(error.message || "An error occurred during sign-up");
      }
      // Handle successful sign-up, e.g., set user state
      return null;
    } catch (error) {
      throw new Error(
        (error as Error).message || "An error occurred during sign-up",
      );
    }
  };

  const signOut = async () => {
    // Implement sign-out logic using better-auth
    await authClient.signOut();
  };

  const googleSignIn = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
      });
      if (error) {
        throw new Error(
          error.message || "An error occurred during Google sign-in",
        );
      }
      // Handle successful Google sign-in, e.g., set user state
      return null;
    } catch (error) {
      throw new Error(
        (error as Error).message || "An error occurred during Google sign-in",
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user,
        token: token,
        isLoading: isLoading,
        signIn,
        signUp,
        signOut,
        googleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => React.useContext(AuthContext);
