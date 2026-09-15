export interface PokemonType {
  label: string;
  apiName: string;
}

export const POKEMON_TYPES: PokemonType[] = [
  { label: "Normal", apiName: "normal" },
  { label: "Fuego", apiName: "fire" },
  { label: "Agua", apiName: "water" },
  { label: "Eléctrico", apiName: "electric" },
  { label: "Planta", apiName: "grass" },
  { label: "Hielo", apiName: "ice" },
  { label: "Lucha", apiName: "fighting" },
  { label: "Veneno", apiName: "poison" },
  { label: "Tierra", apiName: "ground" },
  { label: "Volador", apiName: "flying" },
  { label: "Psíquico", apiName: "psychic" },
  { label: "Bicho", apiName: "bug" },
  { label: "Roca", apiName: "rock" },
  { label: "Fantasma", apiName: "ghost" },
  { label: "Dragón", apiName: "dragon" },
  { label: "Siniestro", apiName: "dark" },
  { label: "Acero", apiName: "steel" },
  { label: "Hada", apiName: "fairy" },
];

export interface PokemonGeneration {
  label: string;
  apiName: string;
  region: string;
}

export const POKEMON_GENERATIONS: PokemonGeneration[] = [
  { label: "Generación I", apiName: "generation-i", region: "Kanto" },
  { label: "Generación II", apiName: "generation-ii", region: "Johto" },
  { label: "Generación III", apiName: "generation-iii", region: "Hoenn" },
  { label: "Generación IV", apiName: "generation-iv", region: "Sinnoh" },
  { label: "Generación V", apiName: "generation-v", region: "Unova" },
  { label: "Generación VI", apiName: "generation-vi", region: "Kalos" },
  { label: "Generación VII", apiName: "generation-vii", region: "Alola" },
  { label: "Generación VIII", apiName: "generation-viii", region: "Galar" },
  { label: "Generación IX", apiName: "generation-ix", region: "Paldea" },
];
