import AsyncStorage from "@react-native-async-storage/async-storage";

const POKEMON_ARRAY = "POKEMON_ARRAY";

export async function updatePokemonStatus(
  id: string,
  isFavorite: boolean
): Promise<void> {
  return new Promise(async (resolve, reject) => {
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
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

export async function isPokemonFavorite(id: string): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const value = await AsyncStorage.getItem(id);
      resolve(value ? true : false);
    } catch (e) {
      reject(e);
    }
  });
}

export async function getFavoritePokemons(): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const array = await AsyncStorage.getItem(POKEMON_ARRAY);
      if (array) {
        const arrayParsed = JSON.parse(array);
        resolve(arrayParsed);
        return;
      }

      resolve([]);
    } catch (e) {
      reject(e);
    }
  });
}
