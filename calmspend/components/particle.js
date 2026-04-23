import { useEffect } from "react";
import { Easing } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const Particle = ({ delay = 0, left = 0 }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-40, { duration: 6000, easing: Easing.linear }),
      -1,
      false,
    );

    translateX.value = withRepeat(
      withTiming(10, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
    opacity: 0.25,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 0,
          left,
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: "#6B983F",
        },
        style,
      ]}
    />
  );
};
