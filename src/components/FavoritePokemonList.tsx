import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View, Dimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import PokemonItem from "./PokemonItem";
import { fetchExactPokemonDataById } from "../utils/fetchPokemonData";
import { getFavoritePokemons } from "../utils/asyncStorage";
import { POKEMON_ITEM_WIDTH } from "../constants/settings";
import AsyncStorage from "@react-native-async-storage/async-storage";

function NoPokemonsInfo() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        width: "80%",
        alignSelf: "center",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
        }}
      >
        There are no favorite pokemons selected yet!
      </Text>
    </View>
  );
}

export default function PokemonList() {
  const [showViews, setShowViews] = useState<boolean>(false);
  const [pokemonList, setPokemonList] = useState<string[]>([]);
  const isFocused = useIsFocused();
  const { width } = Dimensions.get("window");
  const expectedNumberOfColumns = Math.floor(width / POKEMON_ITEM_WIDTH);

  const fetchData = async () => {
    try {
      const favPokemons = await getFavoritePokemons();

      if (JSON.stringify(favPokemons) === JSON.stringify(pokemonList)) return;

      setPokemonList(favPokemons);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    // AsyncStorage.clear();
    (async () => {
      if (isFocused) {
        await fetchData();
        setShowViews(true);
      } else {
        setShowViews(false);
      }
    })();
  }, [isFocused]);

  return (
    <>
      {showViews && (
        <>
          {pokemonList.length === 0 ? (
            <NoPokemonsInfo />
          ) : (
            <FlatList
              data={pokemonList}
              renderItem={({ item }: { item: string }) => (
                <PokemonItem
                  key={item}
                  pokemonInfo={{ url: item } as PokemonListObject}
                  showStar={false}
                />
              )}
              numColumns={expectedNumberOfColumns}
              columnWrapperStyle={{ justifyContent: "center" }}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.container}
            />
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
