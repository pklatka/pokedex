import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import PokemonItem from "./PokemonItem";
import { fetchPokemonData, fetchPokemonList } from "../utils/fetchPokemonData";
import {
  POKEMON_ITEM_WIDTH,
  ON_END_REACHED_THRESHOLD,
} from "../constants/settings";
import { useIsFocused } from "@react-navigation/native";

export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState<PokemonListObject[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const limit: number = 20;
  const isFocused = useIsFocused();
  const { width } = Dimensions.get("window");
  const expectedNumberOfColumns = Math.floor(width / POKEMON_ITEM_WIDTH);

  const fetchData = async () => {
    try {
      const data = await fetchPokemonList(offset, limit);
      setPokemonList([...pokemonList, ...data]);
      setOffset(offset + limit);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  return (
    <>
      {pokemonList.length === 0 ? (
        <ActivityIndicator style={styles.loader} size="large" color="#000000" />
      ) : (
        <FlatList
          data={pokemonList}
          renderItem={({ item }: { item: PokemonListObject }) => (
            <PokemonItem key={item.url} pokemonInfo={item} />
          )}
          numColumns={expectedNumberOfColumns}
          keyExtractor={(item) => item.url}
          columnWrapperStyle={{ justifyContent: "center" }}
          onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
          onEndReached={fetchData}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
