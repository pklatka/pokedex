import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PokemonList from './components/PokemonList';
import PokemonMainScreen from './components/PokemonMainScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

function MainScreenTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="List" component={PokemonList} options={{
        title: 'Pokemon list'
      }} />
      <Tab.Screen name="Favourites" component={SettingsScreen} />
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
