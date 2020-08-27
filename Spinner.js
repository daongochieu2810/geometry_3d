import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import AnimatedLoader from "react-native-animated-loader";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;
export default function Loader({ visible }) {
  //const [visible, setVisible] = useState(false)

  return (
    <AnimatedLoader
      visible={visible}
      overlayColor="rgba(255,255,255,0.75)"
      source={require("./assets/spinner.json")}
      animationStyle={styles.lottie}
      speed={1}
    />
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: SCREEN_WIDTH / 2,
    height: SCREEN_WIDTH / 2,
  },
});
