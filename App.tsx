import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import PokemonList from './components/PokemonList';
import PokemonMainScreen from './components/PokemonMainScreen';
import FavoritePokemonList from './components/FavoritePokemonList'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TemporaryScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>TMP!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

function MainScreenTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="List" component={PokemonList} options={{
        title: 'Pokemon list',
        tabBarIcon: ({ color, size }) => <MaterialIcons name="format-list-bulleted" size={size} color={color} />
      }} />
      <Tab.Screen name="Favorites" component={FavoritePokemonList} options={{
        tabBarIcon: ({ color, size }) => <MaterialIcons name="favorite-border" size={size} color={color} />
      }} />
      <Tab.Screen name="Map" component={TemporaryScreen} options={{
        tabBarIcon: ({ color, size }) => <MaterialIcons name="map" size={size} color={color} />
      }} />

    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainScreenTabs" component={MainScreenTabs} options={{
          headerShown: false
        }} />
        <Stack.Screen name="PokemonDetails" component={PokemonMainScreen} options={{
          title: 'Pokemon details'
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
