import AsyncStorage from "@react-native-async-storage/async-storage";

const POKEMON_ARRAY = "POKEMON_ARRAY";

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
