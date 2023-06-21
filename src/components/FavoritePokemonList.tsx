import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import PokemonItem from "./PokemonItem";
import { fetchExactPokemonDataById } from "../../utils/fetchPokemonData";
import { getFavoritePokemons } from "../../utils/asyncStorage";

const ON_END_REACHED_THRESHOLD = 3.5;

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
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);
  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      const favPokemons = await getFavoritePokemons();

      if (JSON.stringify(favPokemons) === JSON.stringify(pokemonList)) return;

      const data = await Promise.all(
        favPokemons.map((pokemonId: string) =>
          fetchExactPokemonDataById(pokemonId)
        )
      );
      setPokemonList(data);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
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
              renderItem={({ item }: { item: PokemonData }) => (
                <PokemonItem key={item.url} pokemonInfo={item} />
              )}
              numColumns={1}
              keyExtractor={(item) => item.url}
              contentContainerStyle={styles.container}
              onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
              onEndReached={async () => {
                try {
                  await fetchData();
                } catch (e) {
                  alert(e);
                }
              }}
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
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
