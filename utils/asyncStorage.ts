import AsyncStorage from '@react-native-async-storage/async-storage';

const POKEMON_ARRAY = 'POKEMON_ARRAY'

export async function updatePokemonStatus(id: any, isFavorite: boolean) {
    try {
        const array = await AsyncStorage.getItem(POKEMON_ARRAY)

        // Parse array
        let arrayParsed = JSON.parse(array || '[]')

        // Update pokemon status
        if (isFavorite) {
            arrayParsed.push(id)
            await AsyncStorage.setItem(id, '1')
        } else {
            const index = arrayParsed.indexOf(id)
            if (index > -1) {
                arrayParsed = arrayParsed.filter((item: any) => item !== id)
                await AsyncStorage.removeItem(id)
            }
        }

        // Save array
        await AsyncStorage.setItem(POKEMON_ARRAY, JSON.stringify(arrayParsed))

    } catch (e) {
        // saving error
    }
}

export async function isPokemonFavorite(id: any) {
    try {
        const value = await AsyncStorage.getItem(id)
        return value ? true : false
    } catch (e) {
        console.log(e)
        return false
        // error reading value
    }
}

export async function getFavoritePokemons() {
    try {
        const array = await AsyncStorage.getItem(POKEMON_ARRAY)
        if (array) {
            const arrayParsed = JSON.parse(array)
            return arrayParsed
        }
        return []
    } catch (e) {
        console.log(e)
        return []
        // error reading value
    }
}