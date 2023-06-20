import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native'
import PokemonItem from './PokemonItem'

// TODO: Export it from somewhere else
const API_ROUTE = "https://pokeapi.co/api/v2/pokemon"
const LIMIT = 20
const ON_END_REACHED_THRESHOLD = 3

export default function PokemonList({ navigation }) {

    const [pokemonList, setPokemonList] = useState([])
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        console.log("XD")
        fetch(`${API_ROUTE}?limit=${LIMIT}&offset=${offset}`)
            .then(response => response.json())
            .then(data => setPokemonList(data.results))
    }, [])

    return (
        <FlatList
            style={styles.flatList}
            data={pokemonList}
            renderItem={({ item }) => <PokemonItem key={item.url} pokemonUrl={item.url} navigation={navigation} />}
            numColumns={1}
            contentContainerStyle={styles.container}
            keyExtractor={item => item.url}
            onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
            onEndReached={() => {
                // Load more data
                fetch(`${API_ROUTE}?limit=${LIMIT}&offset=${offset + LIMIT}`)
                    .then(response => response.json())
                    .then(data => setPokemonList([...pokemonList, ...data.results]))

                // Update offset
                setOffset(offset + LIMIT)
            }}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    flatList: {
        // backgroundColor: 'blue',
    }
})
