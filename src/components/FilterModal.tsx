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
import { colors, fonts } from "../constants/theme";

const MAX_TYPES = 2;

interface FilterModalProps {
  visible: boolean;
  selectedTypes: string[];
  selectedGeneration: string | null;
  onToggleType: (type: string) => void;
  onSelectGeneration: (generation: string | null) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

export function FilterModal({
  visible,
  selectedTypes,
  selectedGeneration,
  onToggleType,
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
            <Text style={styles.title}>FILTRAR</Text>

            <Text style={styles.sectionLabel}>TIPO (MAX {MAX_TYPES})</Text>
            <View style={styles.chipRow}>
              {POKEMON_TYPES.map((t) => {
                const isSelected = selectedTypes.includes(t.apiName);
                const isDisabled =
                  !isSelected && selectedTypes.length >= MAX_TYPES;
                return (
                  <Pressable
                    key={t.apiName}
                    disabled={isDisabled}
                    style={[
                      styles.chip,
                      isSelected && styles.chipActive,
                      isDisabled && styles.chipDisabled,
                    ]}
                    onPress={() => onToggleType(t.apiName)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextActive,
                        isDisabled && styles.chipTextDisabled,
                      ]}
                    >
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>GENERACION</Text>
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
              <Text style={styles.clearButtonText}>LIMPIAR</Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onApply}>
              <Text style={styles.applyButtonText}>APLICAR</Text>
            </Pressable>
          </View>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>CERRAR</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,56,15,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.screenBg,
    borderTopWidth: 4,
    borderColor: colors.screenLine,
    padding: 20,
    maxHeight: "80%",
  },
  title: {
    fontFamily: fonts.pixel,
    fontSize: 14,
    color: colors.screenLine,
    marginBottom: 12,
  },
  sectionLabel: {
    fontFamily: fonts.pixel,
    fontSize: 9,
    marginTop: 12,
    marginBottom: 6,
    color: colors.screenLine,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.screenLine,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipActive: { backgroundColor: colors.shellPurple },
  chipDisabled: { opacity: 0.4 },
  chipText: { color: colors.black, fontSize: 13 },
  chipTextActive: { color: colors.white, fontWeight: "700" },
  chipTextDisabled: { color: "#888" },
  actionsRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.screenLine,
    alignItems: "center",
  },
  clearButtonText: {
    fontFamily: fonts.pixel,
    fontSize: 9,
    color: colors.black,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.shellPurple,
    borderWidth: 2,
    borderColor: colors.screenLine,
    alignItems: "center",
  },
  applyButtonText: {
    fontFamily: fonts.pixel,
    fontSize: 9,
    color: colors.white,
  },
  closeButton: { marginTop: 12, alignItems: "center" },
  closeButtonText: {
    fontFamily: fonts.pixel,
    fontSize: 8,
    color: colors.screenLine,
  },
});
