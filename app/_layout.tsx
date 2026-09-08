import { Stack } from "expo-router";
import { PokedexProvider } from "../src/context/PokedexContext";

export default function RootLayout() {
  return (
    <PokedexProvider>
      <Stack />
    </PokedexProvider>
  );
}
