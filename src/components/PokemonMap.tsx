import React from "react";
import MapView from "react-native-maps";

export default function PokemonMap() {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    />
  );
}
