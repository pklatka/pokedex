import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { capitalizeFirstLetter } from "../../utils/stringUtils";
import {
  updatePokemonStatus,
  isPokemonFavorite,
} from "../../utils/asyncStorage";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/NavigationTypes";

type PokemonItemProps = {
  pokemonInfo: PokemonData;
};

export default function PokemonItem({ pokemonInfo }: PokemonItemProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    (async () => {
      try {
        const isFavorite = await isPokemonFavorite(String(pokemonInfo.id));
        setIsFavorite(isFavorite);
      } catch (e) {
        alert(e);
      }
    })();
  }, []);

  const handleStarPress = async () => {
    try {
      await updatePokemonStatus(String(pokemonInfo.id), !isFavorite);
      setIsFavorite(!isFavorite);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("PokemonDetails", { pokemonInfo })}
    >
      <View style={[styles.container, styles.shadowProp]}>
        <TouchableOpacity style={styles.star} onPress={handleStarPress}>
          {isFavorite ? (
            <AntDesign name="star" size={24} color="yellow" />
          ) : (
            <AntDesign name="staro" size={24} color="black" />
          )}
        </TouchableOpacity>
        <Image
          style={styles.pokemonImage}
          source={{ uri: pokemonInfo?.sprites?.other?.home?.front_default }}
        ></Image>
        <Text style={styles.pokemonName}>
          {capitalizeFirstLetter(pokemonInfo?.name)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "column",
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#dedede",
    width: 200,
    height: 200,
    borderRadius: 10,
    zIndex: 1,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  pokemonName: {
    fontSize: 28,
  },
  pokemonImage: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
    // backgroundColor: 'red'
  },
  star: {
    width: 40,
    height: 40,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    right: 0,
    zIndex: 2,
  },
});
