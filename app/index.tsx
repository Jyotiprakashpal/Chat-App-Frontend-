import { Redirect } from "expo-router";

// Redirect to the auth page when accessing the root route
export default function Index() {
  return <Redirect href="/auth/login" />;
}
