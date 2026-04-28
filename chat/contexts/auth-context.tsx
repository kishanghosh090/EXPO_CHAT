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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message || "An error occurred during sign-in");
      }
      // Handle successful sign-in, e.g., set user state
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
  ): Promise<void> => {
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
    } catch (error) {
      throw new Error(
        (error as Error).message || "An error occurred during sign-up",
      );
    }
  };

  const signOut = async () => {
    // Implement sign-out logic using better-auth
  };

  return (
    <AuthContext.Provider
      value={{
        user: null,
        token: null,
        isLoading: false,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => React.useContext(AuthContext);
