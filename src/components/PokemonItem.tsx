import React, { useState, useEffect, memo } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { capitalizeFirstLetter } from "../../utils/stringUtils";
import {
  updatePokemonStatus,
  isPokemonFavorite,
} from "../../utils/asyncStorage";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/NavigationTypes";
import { useIsFocused } from "@react-navigation/native";

type PokemonItemProps = {
  pokemonInfo: PokemonData;
  showStar?: boolean;
};

export default memo(function PokemonItem({
  pokemonInfo,
  showStar = true,
}: PokemonItemProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const [hasShownDetails, setHasShownDetails] = useState(false);

  const handleStarPress = async () => {
    try {
      await updatePokemonStatus(String(pokemonInfo.id), !isFavorite);
      setIsFavorite(!isFavorite);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    // TODO: Check what's better
    // hasShownDetails creates another problem when user deletes a pokemon
    // from favorites on favorites screen and switches to list screen
    // if (!isFocused || !hasShownDetails) return;
    if (!isFocused) return;

    (async () => {
      try {
        const isFavorite = await isPokemonFavorite(String(pokemonInfo.id));
        setIsFavorite(isFavorite);
        setHasShownDetails(false);
      } catch (e) {
        alert(e);
      }
    })();
  }, [isFocused]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("PokemonDetails", { pokemonInfo });
        setHasShownDetails(true);
      }}
    >
      <View style={[styles.container, styles.shadowProp]}>
        {showStar && (
          <TouchableOpacity style={styles.star} onPress={handleStarPress}>
            {isFavorite ? (
              <AntDesign name="star" size={24} color="yellow" />
            ) : (
              <AntDesign name="staro" size={24} color="black" />
            )}
          </TouchableOpacity>
        )}
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#dedede",
    width: 100,
    height: 100,
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
    fontSize: 14,
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
