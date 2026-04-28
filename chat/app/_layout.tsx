import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Layout />
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
