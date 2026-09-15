import { Stack } from "expo-router";
import { PokedexProvider } from "../src/context/PokedexContext";

export default function RootLayout() {
  return (
    <PokedexProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PokedexProvider>
  );
}
