import React, { useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const MODAL_HEIGHT = 280;
const MODAL_BOTTOM_MARGIN = 16;
const MODAL_TOTAL_HEIGHT = MODAL_HEIGHT + MODAL_BOTTOM_MARGIN;

type MarkerModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function MarkerModal({ visible, setVisible }: MarkerModalProps) {
  const offset = useSharedValue(MODAL_TOTAL_HEIGHT);
  const startValue = useSharedValue(MODAL_TOTAL_HEIGHT);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    };
  });

  useEffect(() => {
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
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Modal Title</Text>
          <Text style={styles.modalText}>Modal Text</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setVisible(false);
          }}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
