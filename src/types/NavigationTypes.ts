import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  MainScreenTabs: undefined;
  PokemonDetails: { pokemonInfo: PokemonData };
};

export type PokemonPresentationScreenParams = NativeStackScreenProps<
  RootStackParamList,
  "PokemonDetails"
>;

export type RootBottomTabParamList = {
  List: undefined;
  Favorites: undefined;
  Map: undefined;
};

export type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootBottomTabParamList, "List">,
  StackNavigationProp<RootStackParamList>
>;
