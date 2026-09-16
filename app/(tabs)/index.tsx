import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getIdFromUrl } from "../../src/api/pokeapi";
import { FilterModal } from "../../src/components/FilterModal";
import {
  POKEMON_GENERATIONS,
  POKEMON_TYPES,
} from "../../src/constants/pokemonFilters";
import { usePokedex } from "../../src/context/PokedexContext";

export default function PokedexScreen() {
  const {
    pokemonList,
    isLoadingList,
    listError,
    loadMore,
    activeFilters,
    filteredList,
    isLoadingFilter,
    filterError,
    applyFilters,
    clearFilters,
  } = usePokedex();
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [draftTypes, setDraftTypes] = useState<string[]>([]);
  const [draftGeneration, setDraftGeneration] = useState<string | null>(null);

  const openModal = () => {
    setDraftTypes(activeFilters.types);
    setDraftGeneration(activeFilters.generation);
    setIsModalVisible(true);
  };

  const toggleDraftType = (type: string) => {
    setDraftTypes((prev) => {
      if (prev.includes(type)) return prev.filter((t) => t !== type);
      if (prev.length >= 2) return prev; // ya hay 2 seleccionados, ignorar
      return [...prev, type];
    });
  };

  const handleApply = () => {
    applyFilters({ types: draftTypes, generation: draftGeneration });
    setIsModalVisible(false);
  };

  const handleClear = () => {
    clearFilters();
    setIsModalVisible(false);
  };

  const isFiltering = filteredList !== null;
  const displayList = isFiltering ? filteredList : pokemonList;
  const isLoadingDisplay = isFiltering ? isLoadingFilter : isLoadingList;
  const displayError = isFiltering ? filterError : listError;

  const typeLabels = POKEMON_TYPES.filter((t) =>
    activeFilters.types.includes(t.apiName),
  ).map((t) => t.label);
  const generationLabel = POKEMON_GENERATIONS.find(
    (g) => g.apiName === activeFilters.generation,
  )?.label;
  const filterSummary = [...typeLabels, generationLabel]
    .filter(Boolean)
    .join(" + ");

  return (
    <View style={styles.screen}>
      <View style={styles.filterBar}>
        <Pressable style={styles.filterButton} onPress={openModal}>
          <Text style={styles.filterButtonText}>
            {isFiltering ? "Editar filtro" : "Filtrar"}
          </Text>
        </Pressable>
        {isFiltering && (
          <View style={styles.activeFilterInfo}>
            <Text style={styles.activeFilterText} numberOfLines={1}>
              {filterSummary}
            </Text>
            <Pressable onPress={clearFilters}>
              <Text style={styles.clearLink}>Limpiar</Text>
            </Pressable>
          </View>
        )}
      </View>

      {isLoadingDisplay && displayList.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Cargando Pokemon...</Text>
        </View>
      ) : displayError && displayList.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{displayError}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={isFiltering ? () => applyFilters(activeFilters) : loadMore}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : isFiltering && displayList.length === 0 ? (
        <View style={styles.center}>
          <Text>No hay Pokemon que coincidan con ese filtro.</Text>
        </View>
      ) : (
        <FlatList
          data={displayList}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const id = getIdFromUrl(item.url);
            return (
              <Pressable
                style={styles.card}
                onPress={() => router.push(`/pokemon/${id}`)}
              >
                <Text style={styles.cardText}>
                  #{id} {item.name}
                </Text>
              </Pressable>
            );
          }}
          onEndReached={isFiltering ? undefined : loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            !isFiltering && isLoadingList ? (
              <ActivityIndicator style={{ margin: 16 }} />
            ) : null
          }
        />
      )}

      <FilterModal
        visible={isModalVisible}
        selectedTypes={draftTypes}
        selectedGeneration={draftGeneration}
        onToggleType={toggleDraftType}
        onSelectGeneration={setDraftGeneration}
        onApply={handleApply}
        onClear={handleClear}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterButton: {
    backgroundColor: "#3498db",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  filterButtonText: { color: "white", fontWeight: "600" },
  activeFilterInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  activeFilterText: { flex: 1, color: "#333" },
  clearLink: { color: "#c0392b", fontWeight: "600" },
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
