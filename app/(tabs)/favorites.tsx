import { Href, useRouter } from "expo-router";

import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { usePokedex } from "../../src/context/PokedexContext";

export default function FavoritesScreen() {
  const { favorites, isLoadingFavorites, removeFavoriteById } = usePokedex();
  const router = useRouter();

  if (isLoadingFavorites) {
    return (
      <View style={styles.center}>
        <Text>Cargando favoritos...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Aún no tienes Pokémon favoritos.</Text>
        <Text style={styles.hint}>
          Ve a la Pokédex y toca ☆ en cualquier Pokémon para guardarlo aquí.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() => router.push(`/pokemon/${item.id}` as Href)}
        >
          <Text style={styles.cardText}>
            #{item.id} {item.name}
          </Text>
          <Pressable onPress={() => removeFavoriteById(item.id)} hitSlop={8}>
            <Text style={styles.removeText}>✕</Text>
          </Pressable>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  hint: { marginTop: 8, color: "#777", textAlign: "center" },
  list: { padding: 12 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
  },
  cardText: { fontSize: 16, fontWeight: "600", textTransform: "capitalize" },
  removeText: { fontSize: 18, color: "#c0392b" },
});
