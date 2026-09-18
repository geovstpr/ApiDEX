import { Tabs } from "expo-router";
import { colors, fonts } from "../../src/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.shellPurple,
          borderTopWidth: 4,
          borderTopColor: colors.shellPurpleDark,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.white,
        tabBarLabelStyle: {
          fontFamily: fonts.pixel,
          fontSize: 9,
        },
        headerStyle: {
          backgroundColor: colors.shellPurple,
          borderBottomWidth: 4,
          borderBottomColor: colors.shellPurpleDark,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontFamily: fonts.pixel,
          fontSize: 13,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Pokedex" }} />
      <Tabs.Screen name="favorites" options={{ title: "Favoritos" }} />
    </Tabs>
  );
}
