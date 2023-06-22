import { API_ROUTE } from "../constants/settings";

export function fetchExactPokemonDataById(
  pokemonId: string
): Promise<PokemonData> {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${API_ROUTE}/${pokemonId}`;
      const response = await fetch(url);
      const data = await response.json();
      resolve({ ...data, url });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchExactPokemonDataByUrl(
  pokemonUrl: string
): Promise<PokemonData> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(pokemonUrl);
      const data = await response.json();
      resolve({ ...data, url: pokemonUrl });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchPokemonData(
  offset: number = 0,
  limit: number = 20
): Promise<PokemonData[]> {
  return new Promise(async (resolve, reject) => {
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
      resolve(pokemonList);
    } catch (e) {
      reject(e);
    }
  });
}
