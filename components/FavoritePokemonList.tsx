import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native'
import PokemonItem from './PokemonItem'
import { getFavoritePokemons } from '../utils/asyncStorage'
import { useIsFocused } from "@react-navigation/native";

// TODO: Export it from somewhere else
const API_ROUTE = "https://pokeapi.co/api/v2/pokemon"

const fetchPokemonData = (url: string): Promise<Object> => {
    return new Promise((resolve, reject) => {
        console.log(url)
        fetch(url)
            .then(response => response.json())
            .then(data => resolve({ ...data, url }))
            .catch(error => {
                console.log(error)
                reject(error)
            })
    })
}


export default function FavoritePokemonList({ navigation }) {
    const [pokemonList, setPokemonList] = useState([])
    const isFocused = useIsFocused();

    useEffect(() => {
        getFavoritePokemons()
            .then(data => {
                console.log(data)
                if (data.length === 0) return
                Promise.all(data.map((pokemonId: any) => fetchPokemonData(`${API_ROUTE}/${pokemonId}`))).then((data) => {
                    setPokemonList(data)
                }).catch(error => console.log(error))
            }).catch(error => console.log(error))
    }, [isFocused])

    return (
        <>
            {pokemonList.length === 0 ? <ActivityIndicator style={styles.loader} size="large" color="#000000" /> :
                <FlatList
                    data={pokemonList}
                    renderItem={({ item }) => <PokemonItem key={item.url} pokemonInfo={item} navigation={navigation} />}
                    numColumns={1}
                    contentContainerStyle={styles.container}
                    keyExtractor={item => item.url}
                />}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
