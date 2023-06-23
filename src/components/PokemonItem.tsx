import React, { useState, useEffect, memo } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { capitalizeFirstLetter } from "../utils/stringUtils";
import { updatePokemonStatus, isPokemonFavorite } from "../utils/asyncStorage";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/NavigationTypes";
import { useIsFocused } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withTiming,
} from "react-native-reanimated";
import { fetchExactPokemonDataByUrl } from "../utils/fetchPokemonData";

type PokemonItemProps = {
  pokemonInfo: PokemonListObject;
  showStar?: boolean;
};

export default memo(function PokemonItem({
  pokemonInfo,
  showStar = true,
}: PokemonItemProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [pokemonObject, setPokemonObject] = useState<PokemonData>(
    {} as PokemonData
  );
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const [hasShownDetails, setHasShownDetails] = useState(false);

  const handleStarPress = async () => {
    try {
      await updatePokemonStatus(pokemonInfo.url, !isFavorite);
      setIsFavorite(!isFavorite);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    if (!isFocused) return;

    (async () => {
      try {
        // Get pokemon data
        if (pokemonObject?.name) return;

        const pokemonData = await fetchExactPokemonDataByUrl(pokemonInfo.url);
        setPokemonObject(pokemonData);

        const isFavorite = await isPokemonFavorite(pokemonInfo.url);
        setIsFavorite(isFavorite);
        setHasShownDetails(false);

        offset.value = withTiming(0, {
          duration: 1500,
          easing: Easing.out(Easing.exp),
        });
      } catch (e) {
        alert(e);
      }
    })();
  }, [isFocused]);

  const offset = useSharedValue(-1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value * -10 }],
      opacity: offset.value + 1,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("PokemonDetails", { pokemonInfo: pokemonObject });
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
            source={{ uri: pokemonObject?.sprites?.other?.home?.front_default }}
          ></Image>
          <Text style={styles.pokemonName}>
            {capitalizeFirstLetter(pokemonObject?.name)}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
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
