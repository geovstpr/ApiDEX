import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fetchPokemonDetail } from "../../src/api/pokeapi";
import { colors, fonts } from "../../src/constants/theme";
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

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.screenLine} />
        <Text style={styles.loadingText}>CARGANDO...</Text>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error ?? "No se encontro el Pokemon"}
        </Text>
        <Pressable style={styles.retryButton} onPress={loadDetail}>
          <Text style={styles.retryText}>REINTENTAR</Text>
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
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
      >
        <View style={styles.imageFrame}>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>

        <Text style={styles.idText}>
          #{String(pokemon.id).padStart(3, "0")}
        </Text>
        <Text style={styles.name}>{pokemon.name}</Text>

        <View style={styles.typesRow}>
          {pokemon.types.map((t) => (
            <View key={t.type.name} style={styles.typeBadge}>
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>ALT {pokemon.height / 10}m</Text>
          <Text style={styles.infoText}>PESO {pokemon.weight / 10}kg</Text>
        </View>

        <Text style={styles.sectionTitle}>STATS</Text>
        {pokemon.stats.map((s) => (
          <View key={s.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{s.stat.name}</Text>
            <View style={styles.statBarTrack}>
              <View
                style={[
                  styles.statBarFill,
                  { width: `${Math.min(s.base_stat / 1.5, 100)}%` },
                ]}
              />
            </View>
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
            {isFav ? "QUITAR DE FAVORITOS" : "AGREGAR A FAVORITOS"}
          </Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.screenBg },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.screenBg,
  },
  loadingText: {
    fontFamily: fonts.pixel,
    fontSize: 10,
    color: colors.screenLine,
    marginTop: 12,
  },
  container: { padding: 20, alignItems: "center" },
  imageFrame: {
    width: 220,
    height: 220,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.screenLine,
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: 180, height: 180 },
  idText: {
    fontFamily: fonts.pixel,
    fontSize: 11,
    color: colors.screenLine,
    marginTop: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    textTransform: "uppercase",
    color: colors.black,
    marginTop: 4,
  },
  typesRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  typeBadge: {
    backgroundColor: colors.shellPurple,
    borderWidth: 2,
    borderColor: colors.screenLine,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  typeText: {
    color: colors.white,
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: 12,
  },
  infoRow: { flexDirection: "row", gap: 24, marginTop: 16 },
  infoText: { fontFamily: fonts.pixel, fontSize: 9, color: colors.screenLine },
  sectionTitle: {
    fontFamily: fonts.pixel,
    fontSize: 12,
    color: colors.screenLine,
    marginTop: 24,
    alignSelf: "flex-start",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 6,
    gap: 10,
  },
  statName: {
    width: 90,
    textTransform: "uppercase",
    fontSize: 11,
    color: colors.black,
  },
  statBarTrack: {
    flex: 1,
    height: 10,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.screenLine,
  },
  statBarFill: { height: "100%", backgroundColor: colors.shellPurple },
  statValue: {
    width: 30,
    textAlign: "right",
    fontWeight: "700",
    color: colors.black,
  },
  favButton: {
    marginTop: 24,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.screenLine,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  favButtonActive: { backgroundColor: colors.gold },
  favButtonText: { fontFamily: fonts.pixel, fontSize: 9, color: colors.black },
  errorText: {
    color: colors.danger,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  retryButton: {
    backgroundColor: colors.shellPurple,
    borderWidth: 2,
    borderColor: colors.screenLine,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryText: { color: colors.white, fontFamily: fonts.pixel, fontSize: 9 },
});
