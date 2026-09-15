import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { fetchPokemonList } from "../api/pokeapi";
import {
  getFavorites,
  removeFavorite as removeFavoriteFromStorage,
  saveFavorite,
} from "../storage/favoritesStorage";
import { PokemonDetail, PokemonListItem } from "../types/pokemon";

interface PokedexContextType {
  pokemonList: PokemonListItem[];
  isLoadingList: boolean;
  listError: string | null;
  loadMore: () => void;
  favorites: PokemonDetail[];
  isLoadingFavorites: boolean;
  addFavorite: (pokemon: PokemonDetail) => Promise<void>;
  removeFavoriteById: (id: number) => Promise<void>;
  checkIsFavorite: (id: number) => boolean;
}

const PokedexContext = createContext<PokedexContextType | undefined>(undefined);

const PAGE_SIZE = 20;

export function PokedexProvider({ children }: { children: ReactNode }) {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoadingList, setIsLoadingList] = useState(true); //empieza en true
  const [listError, setListError] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<PokemonDetail[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  const isFetchingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current) return; // ya hay una petición en curso, ignorar
    isFetchingRef.current = true;
    setIsLoadingList(true);
    setListError(null);
    try {
      const data = await fetchPokemonList(PAGE_SIZE, offset);
      setPokemonList((prev) => {
        const existingNames = new Set(prev.map((p) => p.name));
        const newItems = data.results.filter((p) => !existingNames.has(p.name));
        return [...prev, ...newItems];
      });
      setOffset((prev) => prev + PAGE_SIZE);
    } catch (err) {
      setListError(
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar Pokémon",
      );
    } finally {
      setIsLoadingList(false);
      isFetchingRef.current = false;
    }
  }, [offset]);

  // Carga inicial: ya NO llama a loadMore() directamente.
  // Nada se actualiza de forma síncrona antes del await, así que no dispara la regla.
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPokemonList(PAGE_SIZE, 0);
        setPokemonList(data.results);
        setOffset(PAGE_SIZE);
      } catch (err) {
        setListError(
          err instanceof Error
            ? err.message
            : "Error desconocido al cargar Pokémon",
        );
      } finally {
        setIsLoadingList(false);
      }
    })();
  }, []);

  // Cargar favoritos guardados al montar el Provider
  useEffect(() => {
    (async () => {
      const stored = await getFavorites();
      setFavorites(stored);
      setIsLoadingFavorites(false);
    })();
  }, []);

  const addFavorite = useCallback(async (pokemon: PokemonDetail) => {
    const updated = await saveFavorite(pokemon);
    setFavorites(updated);
  }, []);

  const removeFavoriteById = useCallback(async (id: number) => {
    const updated = await removeFavoriteFromStorage(id);
    setFavorites(updated);
  }, []);

  const checkIsFavorite = useCallback(
    (id: number) => favorites.some((p) => p.id === id),
    [favorites],
  );

  return (
    <PokedexContext.Provider
      value={{
        pokemonList,
        isLoadingList,
        listError,
        loadMore,
        favorites,
        isLoadingFavorites,
        addFavorite,
        removeFavoriteById,
        checkIsFavorite,
      }}
    >
      {children}
    </PokedexContext.Provider>
  );
}

export function usePokedex() {
  const context = useContext(PokedexContext);
  if (!context) {
    throw new Error("usePokedex debe usarse dentro de un PokedexProvider");
  }
  return context;
}
