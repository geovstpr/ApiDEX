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
import { colors, fonts } from "../../src/constants/theme";
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
      if (prev.length >= 2) return prev;
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
            {isFiltering ? "EDITAR" : "FILTRAR"}
          </Text>
        </Pressable>
        {isFiltering && (
          <View style={styles.activeFilterInfo}>
            <Text style={styles.activeFilterText} numberOfLines={1}>
              {filterSummary}
            </Text>
            <Pressable onPress={clearFilters}>
              <Text style={styles.clearLink}>LIMPIAR</Text>
            </Pressable>
          </View>
        )}
      </View>

      {isLoadingDisplay && displayList.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.screenLine} />
          <Text style={styles.loadingText}>CARGANDO...</Text>
        </View>
      ) : displayError && displayList.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{displayError}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={isFiltering ? () => applyFilters(activeFilters) : loadMore}
          >
            <Text style={styles.retryText}>REINTENTAR</Text>
          </Pressable>
        </View>
      ) : isFiltering && displayList.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            Sin coincidencias para ese filtro.
          </Text>
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
                <Text style={styles.cardId}>
                  #{String(id).padStart(3, "0")}
                </Text>
                <Text style={styles.cardText}>{item.name}</Text>
              </Pressable>
            );
          }}
          onEndReached={isFiltering ? undefined : loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            !isFiltering && isLoadingList ? (
              <ActivityIndicator
                style={{ margin: 16 }}
                color={colors.screenLine}
              />
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
  screen: { flex: 1, backgroundColor: colors.screenBg },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 3,
    borderBottomColor: colors.screenLine,
    backgroundColor: colors.screenBgDark,
  },
  filterButton: {
    backgroundColor: colors.shellPurple,
    borderWidth: 2,
    borderColor: colors.screenLine,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterButtonText: {
    color: colors.white,
    fontFamily: fonts.pixel,
    fontSize: 9,
  },
  activeFilterInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  activeFilterText: { flex: 1, color: colors.screenLine, fontWeight: "700" },
  clearLink: { color: colors.danger, fontFamily: fonts.pixel, fontSize: 8 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    fontFamily: fonts.pixel,
    fontSize: 10,
    color: colors.screenLine,
    marginTop: 12,
  },
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
    fontSize: 16,
    fontWeight: "700",
    color: colors.black,
    textTransform: "uppercase",
  },
  errorText: {
    color: colors.danger,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  emptyText: { color: colors.screenLine, textAlign: "center" },
  retryButton: {
    backgroundColor: colors.shellPurple,
    borderWidth: 2,
    borderColor: colors.screenLine,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryText: { color: colors.white, fontFamily: fonts.pixel, fontSize: 9 },
});
