import { Stack } from "expo-router";
import { useFonts } from "expo-font";

export default function RootLayout() {
  // const [fontsLoaded, error] = useFonts (
  //   "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  // );
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen name="profile" options={{ headerShown: true }} />
    </Stack>
  );
}

