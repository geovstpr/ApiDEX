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
  type: string | null;
  generation: string | null;
}

interface PokedexContextType {
  // Lista de Pokémon
  pokemonList: PokemonListItem[];
  isLoadingList: boolean;
  listError: string | null;
  loadMore: () => void;

  // Favoritos
  favorites: PokemonDetail[];
  isLoadingFavorites: boolean;
  addFavorite: (pokemon: PokemonDetail) => Promise<void>;
  removeFavoriteById: (id: number) => Promise<void>;
  checkIsFavorite: (id: number) => boolean;

  // Filtros
  activeFilters: ActiveFilters;
  filteredList: PokemonListItem[] | null;
  isLoadingFilter: boolean;
  filterError: string | null;
  applyFilters: (filters: ActiveFilters) => Promise<void>;
  clearFilters: () => void;
}

const PokedexContext = createContext<PokedexContextType | undefined>(undefined);

export function PokedexProvider({ children }: { children: ReactNode }) {
  // =========================
  // Lista de Pokémon
  // =========================

  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const isFetchingRef = useRef(false);

  // =========================
  // Favoritos
  // =========================

  const [favorites, setFavorites] = useState<PokemonDetail[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  // =========================
  // Filtros
  // =========================

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    type: null,
    generation: null,
  });

  const [filteredList, setFilteredList] = useState<PokemonListItem[] | null>(
    null,
  );

  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);

  // =========================
  // Cargar lista inicial
  // =========================

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

  // =========================
  // Cargar favoritos
  // =========================

  useEffect(() => {
    (async () => {
      const stored = await getFavorites();

      setFavorites(stored);
      setIsLoadingFavorites(false);
    })();
  }, []);

  // =========================
  // Cargar más Pokémon
  // =========================

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }

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
          : "Error desconocido al cargar Pokémon",
      );
    } finally {
      setIsLoadingList(false);
      isFetchingRef.current = false;
    }
  }, [offset]);

  // =========================
  // Favoritos
  // =========================

  const addFavorite = useCallback(async (pokemon: PokemonDetail) => {
    const updated = await saveFavorite(pokemon);

    setFavorites(updated);
  }, []);

  const removeFavoriteById = useCallback(async (id: number) => {
    const updated = await removeFavoriteFromStorage(id);

    setFavorites(updated);
  }, []);

  const checkIsFavorite = useCallback(
    (id: number) => {
      return favorites.some((pokemon) => pokemon.id === id);
    },
    [favorites],
  );

  // =========================
  // Aplicar filtros
  // =========================

  const applyFilters = useCallback(async (filters: ActiveFilters) => {
    setActiveFilters(filters);

    if (!filters.type && !filters.generation) {
      setFilteredList(null);
      setFilterError(null);
      return;
    }

    setIsLoadingFilter(true);
    setFilterError(null);

    try {
      const [typeResults, generationResults] = await Promise.all([
        filters.type ? fetchPokemonByType(filters.type) : Promise.resolve(null),

        filters.generation
          ? fetchPokemonByGeneration(filters.generation)
          : Promise.resolve(null),
      ]);

      let result: PokemonListItem[];

      if (typeResults && generationResults) {
        // Ambos filtros activos:
        // buscar Pokémon que pertenezcan al tipo Y a la generación.

        const generationNames = new Set(
          generationResults.map((pokemon) => pokemon.name),
        );

        result = typeResults.filter((pokemon) =>
          generationNames.has(pokemon.name),
        );
      } else {
        // Solo uno de los filtros está activo.

        result = typeResults ?? generationResults ?? [];
      }

      setFilteredList(result);
    } catch (err) {
      setFilterError(
        err instanceof Error ? err.message : "Error al aplicar el filtro",
      );

      setFilteredList([]);
    } finally {
      setIsLoadingFilter(false);
    }
  }, []);

  // =========================
  // Limpiar filtros
  // =========================

  const clearFilters = useCallback(() => {
    setActiveFilters({
      type: null,
      generation: null,
    });

    setFilteredList(null);
    setFilterError(null);
  }, []);

  // =========================
  // Provider
  // =========================

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

// =========================
// Hook
// =========================

export function usePokedex() {
  const context = useContext(PokedexContext);

  if (!context) {
    throw new Error("usePokedex debe usarse dentro de un PokedexProvider");
  }

  return context;
}
