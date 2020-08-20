import React from "react";
import { View, Text, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;
export default function AddCone() {
  return (
    <View
      style={{
        width: SCREEN_WIDTH * 0.8,
        paddingLeft: 15,
        marginBottom: 10,
      }}
    >
      <Text>TESTING</Text>
    </View>
  );
}
