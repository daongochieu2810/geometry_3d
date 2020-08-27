import React , {useContext} from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import GeoCard from "./GeoCard";
import CardContext from '../contexts/CardContext'
const { height: wHeight } = Dimensions.get("window");
const height = wHeight - 64;
const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    alignSelf: "center",
  },
});

const AnimatedCard = () => {
  const {
  y,
  index,
  cardH
} = useContext(CardContext)
  const position = Animated.subtract(index * cardH, y);
  const isDisappearing = -cardH;
  const isTop = 0;
  const isBottom = height - cardH;
  const isAppearing = height;
  const translateY = Animated.add(
    Animated.add(
      y,
      y.interpolate({
        inputRange: [0, 0.00001 + index * cardH],
        outputRange: [0, -index * cardH],
        extrapolateRight: "clamp",
      })
    ),
    position.interpolate({
      inputRange: [isBottom, isAppearing],
      outputRange: [0, -cardH / 4],
      extrapolate: "clamp",
    })
  );
  const scale = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.5],
    extrapolate: "clamp",
  });
  const opacity = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.5],
  });
  return (
    <Animated.View
      style={[styles.card, { opacity, transform: [{ translateY }, { scale }] }]}
      key={index}
    >
      <GeoCard />
    </Animated.View>
  );
};

export default AnimatedCard;
