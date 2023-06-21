import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
} from "react-native";
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);
  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const favPokemons = await getFavoritePokemons();
      const data = await Promise.all(
        favPokemons.map((pokemonId: string) =>
          fetchExactPokemonDataById(pokemonId)
        )
      );
      setPokemonList(data);
      setIsLoading(false);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  return (
    <>
      {isLoading && (
        <ActivityIndicator style={styles.loader} size="large" color="#000000" />
      )}

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
