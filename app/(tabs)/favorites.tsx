import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../../src/constants/theme";
import { usePokedex } from "../../src/context/PokedexContext";

export default function FavoritesScreen() {
  const { favorites, isLoadingFavorites, removeFavoriteById } = usePokedex();
  const router = useRouter();

  if (isLoadingFavorites) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>CARGANDO...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Aun no tienes Pokemon favoritos.</Text>
        <Text style={styles.hint}>
          Ve a la Pokedex y toca el boton de favoritos en cualquier Pokemon para
          guardarlo aqui.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.screen}
      data={favorites}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() => router.push(`/pokemon/${item.id}`)}
        >
          <Text style={styles.cardId}>#{String(item.id).padStart(3, "0")}</Text>
          <Text style={styles.cardText}>{item.name}</Text>
          <Pressable onPress={() => removeFavoriteById(item.id)} hitSlop={8}>
            <Text style={styles.removeText}>X</Text>
          </Pressable>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.screenBg },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.screenBg,
  },
  loadingText: {
    fontFamily: fonts.pixel,
    fontSize: 10,
    color: colors.screenLine,
  },
  emptyText: {
    color: colors.screenLine,
    fontWeight: "700",
    textAlign: "center",
  },
  hint: { marginTop: 8, color: colors.screenLine, textAlign: "center" },
  list: { padding: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.screenLine,
    padding: 14,
    marginBottom: 8,
  },
  cardId: { fontFamily: fonts.pixel, fontSize: 9, color: colors.screenLine },
  cardText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: colors.black,
    textTransform: "uppercase",
  },
  removeText: { fontSize: 16, color: colors.danger, fontWeight: "800" },
});
