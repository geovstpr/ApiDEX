import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  fetchPokemonByGeneration,
  fetchPokemonByType,
  fetchPokemonList,
} from "../api/pokeapi";
import {
  getFavorites,
  removeFavorite as removeFavoriteFromStorage,
  saveFavorite,
} from "../storage/favoritesStorage";
import { PokemonDetail, PokemonListItem } from "../types/pokemon";

const PAGE_SIZE = 20;

interface ActiveFilters {
  types: string[];
  generation: string | null;
}

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
  activeFilters: ActiveFilters;
  filteredList: PokemonListItem[] | null;
  isLoadingFilter: boolean;
  filterError: string | null;
  applyFilters: (filters: ActiveFilters) => Promise<void>;
  clearFilters: () => void;
}

const PokedexContext = createContext<PokedexContextType | undefined>(undefined);

// Interseccion generica: devuelve solo los Pokemon presentes en TODAS las listas recibidas
function intersectPokemonLists(lists: PokemonListItem[][]): PokemonListItem[] {
  if (lists.length === 0) return [];
  if (lists.length === 1) return lists[0];

  const [first, ...rest] = lists;
  const restNameSets = rest.map((list) => new Set(list.map((p) => p.name)));

  return first.filter((pokemon) =>
    restNameSets.every((nameSet) => nameSet.has(pokemon.name)),
  );
}

export function PokedexProvider({ children }: { children: ReactNode }) {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const [favorites, setFavorites] = useState<PokemonDetail[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    types: [],
    generation: null,
  });
  const [filteredList, setFilteredList] = useState<PokemonListItem[] | null>(
    null,
  );
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);

  // loadMore sigue igual, para usarla despues desde un boton "Cargar mas"
  const loadMore = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoadingList(true);
    setListError(null);
    try {
      const data = await fetchPokemonList(PAGE_SIZE, offset);
      setPokemonList((prev) => {
        const existingNames = new Set(prev.map((pokemon) => pokemon.name));
        const newItems = data.results.filter(
          (pokemon) => !existingNames.has(pokemon.name),
        );
        return [...prev, ...newItems];
      });
      setOffset((prev) => prev + PAGE_SIZE);
    } catch (err) {
      setListError(
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar Pokemon",
      );
    } finally {
      setIsLoadingList(false);
      isFetchingRef.current = false;
    }
  }, [offset]);

  // Carga inicial: no llama a loadMore, no hay setState antes del await
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
            : "Error desconocido al cargar Pokemon",
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
    (id: number) => favorites.some((pokemon) => pokemon.id === id),
    [favorites],
  );

  const applyFilters = useCallback(async (filters: ActiveFilters) => {
    setActiveFilters(filters);

    const hasTypes = filters.types.length > 0;
    const hasGeneration = !!filters.generation;

    if (!hasTypes && !hasGeneration) {
      setFilteredList(null);
      setFilterError(null);
      return;
    }

    setIsLoadingFilter(true);
    setFilterError(null);
    try {
      // Una peticion por cada tipo seleccionado, mas una para la generacion si aplica
      const lists = await Promise.all([
        ...filters.types.map((type) => fetchPokemonByType(type)),
        ...(filters.generation
          ? [fetchPokemonByGeneration(filters.generation)]
          : []),
      ]);

      setFilteredList(intersectPokemonLists(lists));
    } catch (err) {
      setFilterError(
        err instanceof Error ? err.message : "Error al aplicar el filtro",
      );
      setFilteredList([]);
    } finally {
      setIsLoadingFilter(false);
    }
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({ types: [], generation: null });
    setFilteredList(null);
    setFilterError(null);
  }, []);

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
        activeFilters,
        filteredList,
        isLoadingFilter,
        filterError,
        applyFilters,
        clearFilters,
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
