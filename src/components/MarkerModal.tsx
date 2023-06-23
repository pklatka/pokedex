import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  TextInput,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ModalType } from "../enums/ModalType";
import type { MarkerModalProps, MarkerObject } from "../types/MapTypes";
import { AntDesign } from "@expo/vector-icons";

const MODAL_HEIGHT = 280;
const MODAL_BOTTOM_MARGIN = 16;
const MODAL_TOTAL_HEIGHT = MODAL_HEIGHT + MODAL_BOTTOM_MARGIN;

function RemoveMarkerView({ marker }: { marker: MarkerObject | null }) {
  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>{marker?.title}</Text>
      <Text style={styles.modalText}>{marker?.description}</Text>
    </View>
  );
}

type AddMarkerViewProps = {
  pokemonName: string;
  setPokemonName: (name: string) => void;
  pokemonCatchDate: Date;
  setPokemonCatchDate: (date: Date) => void;
};

function AddMarkerView({
  pokemonName,
  setPokemonName,
  pokemonCatchDate: date,
  setPokemonCatchDate: setDate,
}: AddMarkerViewProps) {
  const isPlatformIOS = Platform.OS === "ios";
  const [show, setShow] = useState(isPlatformIOS);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!isPlatformIOS) setShow(false);
    setDate(selectedDate || new Date());
  };

  return (
    <View style={styles.modalContent}>
      <TextInput
        style={styles.modalInput}
        placeholder="Pokemon name"
        value={pokemonName}
        onChangeText={setPokemonName}
      />
      <View>
        {!isPlatformIOS && (
          <View style={styles.dateWrapper}>
            <Text style={styles.dateText}>
              {date.toLocaleDateString() + " " + date.toLocaleTimeString()}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShow(true);
              }}
            >
              <AntDesign name="calendar" size={30} color="black" />
            </TouchableOpacity>
          </View>
        )}

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={"datetime"}
            onChange={onDateChange}
          />
        )}
      </View>
    </View>
  );
}

export default function MarkerModal({
  modalType,
  visible,
  setVisible,
  markerHandler,
  currentMarker,
}: MarkerModalProps) {
  const [pokemonName, setPokemonName] = useState<string>("");
  const [pokemonCatchDate, setPokemonCatchDate] = useState<Date>(new Date());

  const offset = useSharedValue(MODAL_TOTAL_HEIGHT);
  const startValue = useSharedValue(MODAL_TOTAL_HEIGHT);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    };
  });

  useEffect(() => {
    if (!visible) {
      setPokemonName("");
    }
    offset.value = withTiming(visible ? 0 : MODAL_TOTAL_HEIGHT, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  }, [visible]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      startValue.value = offset.value;
    })
    .onUpdate((e) => {
      const newOffset = startValue.value + e.translationY;
      if (newOffset < 0) {
        offset.value = 0;
      } else if (newOffset > MODAL_TOTAL_HEIGHT) {
        offset.value = MODAL_TOTAL_HEIGHT;
      } else {
        offset.value = newOffset;
      }
    })
    .onEnd(() => {
      if (offset.value > MODAL_TOTAL_HEIGHT / 2 - 50) {
        offset.value = withTiming(MODAL_TOTAL_HEIGHT, {
          duration: 500,
          easing: Easing.out(Easing.exp),
        });

        runOnJS(setVisible)(false);
      } else {
        offset.value = withTiming(0, {
          duration: 500,
          easing: Easing.out(Easing.exp),
        });

        runOnJS(setVisible)(true);
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.modalContainer, animatedStyle]}>
        <View style={styles.hand}></View>
        {modalType == ModalType.New ? (
          <AddMarkerView
            pokemonName={pokemonName}
            setPokemonName={setPokemonName}
            pokemonCatchDate={pokemonCatchDate}
            setPokemonCatchDate={setPokemonCatchDate}
          />
        ) : (
          <RemoveMarkerView marker={currentMarker} />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setVisible(false);
            if (!currentMarker) return;
            markerHandler({
              id: currentMarker.id,
              title: pokemonName,
              description: `Catch date: ${pokemonCatchDate.toLocaleDateString()} ${pokemonCatchDate.toLocaleTimeString()}`,
              coordinate: currentMarker.coordinate,
            });
          }}
        >
          <Text style={styles.buttonText}>
            {modalType == ModalType.New ? "Add new pokemon" : "Delete pokemon"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  hand: {
    position: "absolute",
    top: 8,
    width: "40%",
    height: 8,
    backgroundColor: "#dddddd",
    borderRadius: 8,
  },
  dateWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 220,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 17,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingTop: 8,
  },
  modalContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: MODAL_BOTTOM_MARGIN,
    height: MODAL_HEIGHT,
    backgroundColor: "white",
    borderRadius: 16,
    shadowProp: {
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    zIndex: 5,
  },
  modalInput: {
    width: "90%",
    marginBottom: 16,
    fontSize: 24,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    width: "90%",
    marginBottom: 16,
    backgroundColor: "#dddd",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    height: 48,
  },
  buttonText: {
    fontSize: 18,
    color: "#333",
  },
});
