import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { getIdFromUrl } from "../../src/api/pokeapi";
import { usePokedex } from "../../src/context/PokedexContext";

export default function PokedexScreen() {
  const { pokemonList, isLoadingList, listError, loadMore } = usePokedex();
  const router = useRouter();

  // Loading inicial (todavía no hay nada que mostrar)
  if (isLoadingList && pokemonList.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando Pokémon...</Text>
      </View>
    );
  }

  // Error en la carga inicial (todavía no hay nada que mostrar)
  if (listError && pokemonList.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}> {listError}</Text>
        <Pressable style={styles.retryButton} onPress={loadMore}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={pokemonList}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const id = getIdFromUrl(item.url);
        return (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/pokemon/${id}` as Href)}
          >
            <Text style={styles.cardText}>
              #{id} {item.name}
            </Text>
          </Pressable>
        );
      }}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoadingList ? <ActivityIndicator style={{ margin: 16 }} /> : null
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  list: { padding: 12 },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
  },
  cardText: { fontSize: 16, fontWeight: "600", textTransform: "capitalize" },
  errorText: { color: "#c0392b", marginBottom: 12, textAlign: "center" },
  retryButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: { color: "white", fontWeight: "600" },
});
