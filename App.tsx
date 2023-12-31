import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import PokemonList from "./src/components/PokemonList";
import PokemonDetails from "./src/components/PokemonDetails";
import FavoritePokemonList from "./src/components/FavoritePokemonList";
import {
  RootStackParamList,
  RootBottomTabParamList,
} from "./src/types/NavigationTypes";
import PokemonMap from "./src/components/PokemonMap";

const Tab = createBottomTabNavigator<RootBottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function MainScreenTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="List"
        component={PokemonList}
        options={{
          title: "Pokemon list",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritePokemonList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite-border" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={PokemonMap}
        options={{
          title: "Pokemon map",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainScreenTabs"
          component={MainScreenTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PokemonDetails"
          component={PokemonDetails}
          options={{
            title: "Pokemon details",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
