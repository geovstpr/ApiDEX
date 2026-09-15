import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { fetchPokemonDetail } from "../../src/api/pokeapi";
import { usePokedex } from "../../src/context/PokedexContext";
import { PokemonDetail } from "../../src/types/pokemon";

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addFavorite, removeFavoriteById, checkIsFavorite } = usePokedex();

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPokemonDetail(id);
      setPokemon(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await fetchPokemonDetail(id);
        setPokemon(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (error || !pokemon) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error ?? "No se encontró el Pokémon"}
        </Text>
        <Pressable style={styles.retryButton} onPress={loadDetail}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  const isFav = checkIsFavorite(pokemon.id);
  const imageUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default;

  return (
    <>
      <Stack.Screen options={{ title: pokemon.name }} />
      <ScrollView contentContainerStyle={styles.container}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        <Text style={styles.name}>
          #{pokemon.id} {pokemon.name}
        </Text>

        <View style={styles.typesRow}>
          {pokemon.types.map((t) => (
            <View key={t.type.name} style={styles.typeBadge}>
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Altura: {pokemon.height / 10} m</Text>
          <Text style={styles.infoText}>Peso: {pokemon.weight / 10} kg</Text>
        </View>

        <Text style={styles.sectionTitle}>Estadísticas</Text>
        {pokemon.stats.map((s) => (
          <View key={s.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{s.stat.name}</Text>
            <Text style={styles.statValue}>{s.base_stat}</Text>
          </View>
        ))}

        <Pressable
          style={[styles.favButton, isFav && styles.favButtonActive]}
          onPress={() =>
            isFav ? removeFavoriteById(pokemon.id) : addFavorite(pokemon)
          }
        >
          <Text style={styles.favButtonText}>
            {isFav ? "★ Quitar de favoritos" : "☆ Agregar a favoritos"}
          </Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: { padding: 20, alignItems: "center" },
  image: { width: 200, height: 200 },
  name: {
    fontSize: 24,
    fontWeight: "700",
    textTransform: "capitalize",
    marginTop: 8,
  },
  typesRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  typeBadge: {
    backgroundColor: "#3498db",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: { color: "white", fontWeight: "600", textTransform: "capitalize" },
  infoRow: { flexDirection: "row", gap: 24, marginTop: 16 },
  infoText: { fontSize: 14, color: "#555" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 24,
    alignSelf: "flex-start",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 4,
  },
  statName: { textTransform: "capitalize", color: "#333" },
  statValue: { fontWeight: "600" },
  favButton: {
    marginTop: 24,
    backgroundColor: "#eee",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  favButtonActive: { backgroundColor: "#f1c40f" },
  favButtonText: { fontWeight: "700" },
  errorText: { color: "#c0392b", marginBottom: 12, textAlign: "center" },
  retryButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: { color: "white", fontWeight: "600" },
});
