import React, { useState, useEffect } from 'react'
import { View, Text, TouchableHighlight, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';

export default function PokemonItem({ pokemonUrl, navigation }: { pokemonUrl: string, navigation: any }) {
    const [pokemonInfo, setPokemonInfo] = useState(null)
    const [isFavorite, setIsFavorite] = useState(false)

    useEffect(() => {
        fetch(pokemonUrl)
            .then(response => response.json())
            .then(data => setPokemonInfo(data))
    }, [])

    return (
        <TouchableOpacity onPress={() => navigation.navigate('PokemonDetails', { pokemonInfo })}>
            <View style={[styles.container, styles.shadowProp]}>
                <TouchableOpacity style={styles.star} onPress={() => setIsFavorite(!isFavorite)}>
                    {isFavorite ? <AntDesign name="star" size={24} color="yellow" /> : <AntDesign name="staro" size={24} color="black" />}
                </TouchableOpacity>
                <Image style={styles.pokemonImage} source={{ uri: pokemonInfo?.sprites?.other.home.front_default }}></Image>
                <Text style={styles.pokemonName}>{capitalizeFirstLetter(pokemonInfo?.name)}</Text>
            </View>
        </TouchableOpacity >
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#dedede',
        width: 200,
        height: 200,
        borderRadius: 10,
        zIndex: 1,
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    pokemonName: {
        fontSize: 28,
    },
    pokemonImage: {
        width: '100%',
        height: '80%',
        resizeMode: 'contain',
        // backgroundColor: 'red'
    },
    star: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 2,
    }
})
