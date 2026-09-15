import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Pokédex" }} />
      <Tabs.Screen name="favorites" options={{ title: "Favoritos" }} />
    </Tabs>
  );
}
