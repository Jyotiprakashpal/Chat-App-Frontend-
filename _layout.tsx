import { useContext, useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthContext, AuthProvider } from "./app/context/Authcontext";

function AuthLayout() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";
    const inMainGroup = segments[0] === "main";

    if (!user && inMainGroup) {
      // Redirect to login if not authenticated and trying to access main routes
      router.replace("/auth");
    } else if (user && inAuthGroup) {
      // Redirect to home if authenticated and trying to access auth routes
      router.replace("/main/home");
    }
  }, [user, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure context is initialized
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <AuthProvider>
      <AuthLayout />
    </AuthProvider>
  );
}
