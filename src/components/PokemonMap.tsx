import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import MarkerModal from "./MarkerModal";

type Marker = {
  id: number;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
};

export default function PokemonMap() {
  const [modalVisible, setModalVisible] = useState(false);
  const [markers, setMarkers] = useState<Marker[]>([]);

  return (
    <>
      <MapView
        onLongPress={(e) => {
          // Add a marker
          setModalVisible(true);

          setMarkers([
            ...markers,
            {
              id: markers.length,
              coordinate: e.nativeEvent.coordinate,
              title: "Marker",
              description: "Description",
            },
          ]);
        }}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {markers.map((marker) => {
          return (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              onPress={() => {
                setModalVisible(true);
              }}
            />
          );
        })}
      </MapView>
      <MarkerModal visible={modalVisible} setVisible={setModalVisible} />
    </>
  );
}
