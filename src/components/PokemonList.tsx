import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import PokemonItem from "./PokemonItem";
import { fetchPokemonData } from "../../utils/fetchPokemonData";

const ON_END_REACHED_THRESHOLD = 3.5;

export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [rerenderList, setRerenderList] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const limit: number = 20;

  const fetchData = async () => {
    try {
      const data = await fetchPokemonData(offset, limit);
      setPokemonList([...pokemonList, ...data]);
      setOffset(offset + limit);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setRerenderList(!rerenderList);
    }
  }, [isFocused]);

  return (
    <>
      {pokemonList.length === 0 ? (
        <ActivityIndicator style={styles.loader} size="large" color="#000000" />
      ) : (
        <FlatList
          data={pokemonList}
          renderItem={({ item }: { item: PokemonData }) => (
            <PokemonItem key={item.url} pokemonInfo={item} />
          )}
          numColumns={1}
          extraData={rerenderList}
          keyExtractor={(item) => item.url}
          contentContainerStyle={styles.container}
          onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
          onEndReached={fetchData}
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
