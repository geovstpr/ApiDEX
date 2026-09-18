import {
  PressStart2P_400Regular,
  useFonts,
} from "@expo-google-fonts/press-start-2p";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { PokedexProvider } from "../src/context/PokedexContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PokedexProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PokedexProvider>
  );
}
