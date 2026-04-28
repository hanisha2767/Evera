import { Stack } from "expo-router";
import { AppProvider } from "./AppContext";

export default function Layout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppProvider>
  );
}