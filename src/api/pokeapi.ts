import {
  GenerationResponse,
  PokemonDetail,
  PokemonListItem,
  PokemonListResponse,
  PokemonTypeResponse,
} from "../types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(
  limit = 20,
  offset = 0,
): Promise<PokemonListResponse> {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
  );

  if (!response.ok) {
    throw new Error(
      `Error al obtener la lista de Pokémon (${response.status})`,
    );
  }

  return response.json();
}

export async function fetchPokemonDetail(
  nameOrId: string | number,
): Promise<PokemonDetail> {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);

  if (!response.ok) {
    throw new Error(`No se encontró el Pokémon "${nameOrId}"`);
  }

  return response.json();
}

export function getIdFromUrl(url: string): number {
  const segments = url.split("/").filter(Boolean); // quita strings vacíos
  return Number(segments[segments.length - 1]);
}

export async function fetchPokemonByType(
  typeName: string,
): Promise<PokemonListItem[]> {
  const response = await fetch(`${BASE_URL}/type/${typeName}`);
  if (!response.ok) {
    throw new Error(
      `Error al obtener el tipo "${typeName}" (${response.status})`,
    );
  }
  const data: PokemonTypeResponse = await response.json();
  return data.pokemon.map((entry) => entry.pokemon);
}

export async function fetchPokemonByGeneration(
  generationName: string,
): Promise<PokemonListItem[]> {
  const response = await fetch(`${BASE_URL}/generation/${generationName}`);
  if (!response.ok) {
    throw new Error(
      `Error al obtener la generación "${generationName}" (${response.status})`,
    );
  }
  const data: GenerationResponse = await response.json();
  return data.pokemon_species;
}
