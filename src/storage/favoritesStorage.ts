import AsyncStorage from "@react-native-async-storage/async-storage";
import { PokemonDetail } from "../types/pokemon";

const FAVORITES_KEY = "@apidex_favorites";

export async function getFavorites(): Promise<PokemonDetail[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveFavorite(
  pokemon: PokemonDetail,
): Promise<PokemonDetail[]> {
  const current = await getFavorites();

  const alreadyExists = current.some((p) => p.id === pokemon.id);
  if (alreadyExists) return current;

  const updated = [...current, pokemon];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeFavorite(id: number): Promise<PokemonDetail[]> {
  const current = await getFavorites();
  const updated = current.filter((p) => p.id !== id);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export async function isFavorite(id: number): Promise<boolean> {
  const current = await getFavorites();
  return current.some((p) => p.id === id);
}
