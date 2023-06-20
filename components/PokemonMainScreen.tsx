import React, { useState, useEffect } from 'react'
import { View, Text, TouchableHighlight, Image, StyleSheet, TouchableOpacity } from 'react-native'
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter'
import { AntDesign } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

const convertStatNameToReadable = (statName: string): string => {
    return statName?.split('-').map(word => capitalizeFirstLetter(word)).join(' ')
}

function PokemonStat({ statName, statValue }: { statName: string, statValue: number }) {
    return (
        <View style={styles.pokemonStatsContainer} >
            <Text style={styles.pokemonStatsText}>{convertStatNameToReadable(statName)}:</Text>
            <Text style={styles.pokemonStatsText}>{statValue}</Text>
        </View>
    )
}

// TODO: add colors depending on ability category (if exists?)
function PokemonAbility({ abilityName }: { abilityName: string }) {
    return (
        <View style={styles.pokemonAbilityContainer}>
            <Text style={{
                fontSize: 20
            }}>{abilityName}</Text>
        </View>
    )
}

export default function PokemonItem({ route, navigation }: { route: any, navigation: any }) {
    const { pokemonInfo } = route.params
    const [isFavorite, setIsFavorite] = useState(false)

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.mainTitle}>{capitalizeFirstLetter(pokemonInfo?.name)}</Text>
            <TouchableOpacity style={styles.star} onPress={() => setIsFavorite(!isFavorite)}>
                {isFavorite ? <AntDesign name="star" size={33} color="yellow" /> : <AntDesign name="staro" size={33} color="black" />}
            </TouchableOpacity>
            <Image style={{ width: 200, height: 200 }} source={{ uri: pokemonInfo?.sprites?.other.home.front_default }}></Image>

            <Text style={styles.sectionTitle}>Stats</Text>
            <View style={styles.pokemonStatsWrapper}>
                <PokemonStat statName="Weight" statValue={pokemonInfo?.weight} />
                <PokemonStat statName="Base experience" statValue={pokemonInfo?.base_experience} />
                {pokemonInfo?.stats.map((stat: any) => {
                    return <PokemonStat key={stat?.stat?.name} statName={stat?.stat?.name} statValue={stat?.base_stat} />
                })}
            </View>

            <Text style={styles.sectionTitle}>Abilities</Text>
            <View style={styles.pokemonAbilitiesWrapper}>
                {pokemonInfo?.abilities.map((ability: any) => {
                    return <PokemonAbility key={ability?.ability?.name} abilityName={capitalizeFirstLetter(ability?.ability?.name)} />
                })}
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'column',
        // justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
    star: {
        position: 'absolute',
        right: 15,
        top: 19,
    },
    mainTitle: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: 15,
    },
    pokemonStatsWrapper: {
        marginTop: 10,
        flexDirection: 'column',
        // width: '60%'
        width: 265,

    },
    pokemonStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: '#dedede',
        // width: 300,

    },
    pokemonStatsText: {
        fontSize: 20,
    },
    pokemonAbilitiesWrapper: {
        width: 265,
        justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    pokemonAbilityContainer: {
        backgroundColor: '#dedede',
        padding: 10,
        borderRadius: 10,
        margin: 10,

    }

})
