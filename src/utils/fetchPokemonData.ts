import { API_ROUTE } from "../constants/settings";

export async function fetchExactPokemonDataById(
  pokemonId: string
): Promise<PokemonData> {
  try {
    const url = `${API_ROUTE}/${pokemonId}`;
    const response = await fetch(url);
    const data = await response.json();
    return { ...data, url };
  } catch (e) {
    throw e;
  }
}
export async function fetchExactPokemonDataByUrl(
  pokemonUrl: string
): Promise<PokemonData> {
  try {
    const response = await fetch(pokemonUrl);
    const data = await response.json();
    return { ...data, url: pokemonUrl };
  } catch (e) {
    throw e;
  }
}

export async function fetchPokemonList(
  offset: number = 0,
  limit: number = 20
): Promise<PokemonListObject[]> {
  try {
    const response = await fetch(
      `${API_ROUTE}?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();
    return data.results;
  } catch (e) {
    throw e;
  }
}

export async function fetchPokemonData(
  offset: number = 0,
  limit: number = 20
): Promise<PokemonData[]> {
  try {
    const response = await fetch(
      `${API_ROUTE}?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();
    const pokemonList = await Promise.all(
      data.results.map((pokemon: PokemonListObject) =>
        fetchExactPokemonDataByUrl(pokemon.url)
      )
    );
    return pokemonList;
  } catch (e) {
    throw e;
  }
}
