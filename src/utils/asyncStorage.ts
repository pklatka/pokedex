import AsyncStorage from "@react-native-async-storage/async-storage";
import { MarkerObject } from "../types/MapTypes";

const POKEMON_ARRAY = "POKEMON_ARRAY";
const SPOTTED_POKEMON_ARRAY = "SPOTTED_POKEMON_ARRAY";

export async function addSpottedPokemon(pokemon: string): Promise<void> {
  try {
    let pokemonArray = JSON.parse(
      (await AsyncStorage.getItem(SPOTTED_POKEMON_ARRAY)) || "[]"
    );

    pokemonArray.push(pokemon);

    await AsyncStorage.setItem(
      SPOTTED_POKEMON_ARRAY,
      JSON.stringify(pokemonArray)
    );
  } catch (e) {
    throw e;
  }
}

export async function getSpottedPokemons(): Promise<MarkerObject[]> {
  try {
    const array = await AsyncStorage.getItem(SPOTTED_POKEMON_ARRAY);
    if (array) {
      const arrayParsed = JSON.parse(array);
      return arrayParsed.map((item: any) => JSON.parse(item));
    }

    return [];
  } catch (e) {
    throw e;
  }
}

export async function removeSpottedPokemon(pokemon: string): Promise<void> {
  try {
    let pokemonArray = JSON.parse(
      (await AsyncStorage.getItem(SPOTTED_POKEMON_ARRAY)) || "[]"
    );

    pokemonArray = pokemonArray.filter((item: any) => item !== pokemon);

    await AsyncStorage.setItem(
      SPOTTED_POKEMON_ARRAY,
      JSON.stringify(pokemonArray)
    );
  } catch (e) {
    throw e;
  }
}

export async function updatePokemonStatus(
  id: string,
  isFavorite: boolean
): Promise<void> {
  try {
    let pokemonArray = JSON.parse(
      (await AsyncStorage.getItem(POKEMON_ARRAY)) || "[]"
    );

    if (isFavorite) {
      pokemonArray.push(id);
      await AsyncStorage.setItem(id, "1");
    } else {
      pokemonArray = pokemonArray.filter((item: any) => item !== id);
      await AsyncStorage.removeItem(id);
    }

    await AsyncStorage.setItem(POKEMON_ARRAY, JSON.stringify(pokemonArray));
  } catch (e) {
    throw e;
  }
}

export async function isPokemonFavorite(id: string): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(id);
    return !!value;
  } catch (e) {
    throw e;
  }
}

export async function getFavoritePokemons(): Promise<string[]> {
  try {
    const array = await AsyncStorage.getItem(POKEMON_ARRAY);
    if (array) {
      const arrayParsed = JSON.parse(array);
      return arrayParsed;
    }

    return [];
  } catch (e) {
    throw e;
  }
}
