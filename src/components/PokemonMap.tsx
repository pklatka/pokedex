import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import MarkerModal from "./MarkerModal";
import * as Location from "expo-location";
import { ModalType } from "../enums/ModalType";
import type { MarkerObject } from "../types/MapTypes";
import { Platform } from "react-native";

export default function PokemonMap() {
  const [addNewMarkerModalVisible, setAddNewMarkerModalVisible] =
    useState<boolean>(false);
  const [removeMarkerModalVisible, setRemoveMarkerModalVisible] =
    useState<boolean>(false);
  const [markers, setMarkers] = useState<MarkerObject[]>([]);
  const ref = useRef<MapView>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerObject | null>(
    null
  );

  const addNewMarker = (marker: MarkerObject) => {
    selectedMarker!.description = marker?.description;
    selectedMarker!.title = marker?.title;
    setMarkers([...markers, selectedMarker!]);
  };

  const removeMarker = () => {
    setMarkers(markers.filter((marker) => marker?.id !== selectedMarker?.id));
    setSelectedMarker(null);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      ref?.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  useEffect(() => {
    if (!addNewMarkerModalVisible && selectedMarker) {
      setSelectedMarker(null);
    }
  }, [addNewMarkerModalVisible]);

  return (
    <>
      <MapView
        ref={ref}
        onPress={(e) => {
          setSelectedMarker(null);
          setAddNewMarkerModalVisible(false);
          setRemoveMarkerModalVisible(false);
        }}
        onLongPress={(e) => {
          // Add a marker
          setRemoveMarkerModalVisible(false);
          setAddNewMarkerModalVisible(true);
          setSelectedMarker({
            id: markers.length + 1,
            coordinate: e.nativeEvent.coordinate,
            title: "",
            description: "",
          });

          ref?.current?.animateToRegion({
            latitude: e.nativeEvent.coordinate.latitude - 0.001,
            longitude: e.nativeEvent.coordinate.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }}
        style={{ flex: 1 }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsCompass={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        {selectedMarker && (
          <Marker
            key={selectedMarker.id}
            coordinate={selectedMarker.coordinate}
            title={selectedMarker.title}
            description={selectedMarker.description}
          />
        )}

        {markers.map((marker) => {
          return (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={
                Platform.OS === "ios"
                  ? "Click for more details"
                  : marker.description
              }
              onCalloutPress={() => {
                setSelectedMarker(marker);
                setAddNewMarkerModalVisible(false);
                setRemoveMarkerModalVisible(true);
              }}
              onPress={() => {
                setSelectedMarker(marker);
                setAddNewMarkerModalVisible(false);
                setRemoveMarkerModalVisible(true);
              }}
            />
          );
        })}
      </MapView>
      <MarkerModal
        modalType={ModalType.New}
        visible={addNewMarkerModalVisible}
        setVisible={setAddNewMarkerModalVisible}
        markerHandler={addNewMarker}
        currentMarker={selectedMarker}
      />
      <MarkerModal
        modalType={ModalType.Remove}
        visible={removeMarkerModalVisible}
        setVisible={setRemoveMarkerModalVisible}
        markerHandler={removeMarker}
        currentMarker={selectedMarker}
      />
    </>
  );
}
