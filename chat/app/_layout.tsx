import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { queryClient } from "@/utils/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Layout />
      </QueryClientProvider>
    </AuthProvider>
  );
}

function Layout() {
  const { user, isLoading } = useAuth();
  const isLoggedIn = !!user;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* id guard true we can go to this route otherwise we can't */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
