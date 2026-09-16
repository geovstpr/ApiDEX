import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    POKEMON_GENERATIONS,
    POKEMON_TYPES,
} from "../constants/pokemonFilters";

interface FilterModalProps {
  visible: boolean;
  selectedType: string | null;
  selectedGeneration: string | null;
  onSelectType: (type: string | null) => void;
  onSelectGeneration: (generation: string | null) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

export function FilterModal({
  visible,
  selectedType,
  selectedGeneration,
  onSelectType,
  onSelectGeneration,
  onApply,
  onClear,
  onClose,
}: FilterModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Filtrar Pokemon</Text>

            <Text style={styles.sectionLabel}>Tipo</Text>
            <View style={styles.chipRow}>
              {POKEMON_TYPES.map((t) => (
                <Pressable
                  key={t.apiName}
                  style={[
                    styles.chip,
                    selectedType === t.apiName && styles.chipActive,
                  ]}
                  onPress={() =>
                    onSelectType(selectedType === t.apiName ? null : t.apiName)
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedType === t.apiName && styles.chipTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Generacion</Text>
            <View style={styles.chipRow}>
              {POKEMON_GENERATIONS.map((g) => (
                <Pressable
                  key={g.apiName}
                  style={[
                    styles.chip,
                    selectedGeneration === g.apiName && styles.chipActive,
                  ]}
                  onPress={() =>
                    onSelectGeneration(
                      selectedGeneration === g.apiName ? null : g.apiName,
                    )
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedGeneration === g.apiName && styles.chipTextActive,
                    ]}
                  >
                    {g.label} ({g.region})
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View style={styles.actionsRow}>
            <Pressable style={styles.clearButton} onPress={onClear}>
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onApply}>
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </Pressable>
          </View>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
    color: "#555",
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  chipActive: { backgroundColor: "#3498db" },
  chipText: { color: "#333", fontSize: 13 },
  chipTextActive: { color: "white", fontWeight: "600" },
  actionsRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  clearButtonText: { fontWeight: "600", color: "#333" },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#3498db",
    alignItems: "center",
  },
  applyButtonText: { fontWeight: "700", color: "white" },
  closeButton: { marginTop: 12, alignItems: "center" },
  closeButtonText: { color: "#999" },
});
