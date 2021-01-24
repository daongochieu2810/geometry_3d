import React, { useContext } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation } from "react-navigation-hooks";
import CardContext from "../contexts/CardContext";
export default () => {
  const navigation = useNavigation();
  const {
    name,
    pic,
    path,
    cardW,
    cardH,
    isHorizontal,
    index,
    eventEmitter,
  } = useContext(CardContext);
  return (
    <TouchableOpacity
      style={{
        width: cardW,
        height: cardH,
        backgroundColor: "black",
        borderRadius: isHorizontal ? 10 : 24,
        marginRight: isHorizontal ? 5 : 0,
        marginLeft: isHorizontal ? 5 : 0,
      }}
      onPress={() => {
        if (path !== "") navigation.navigate(path);
        else if (eventEmitter != null) {
          eventEmitter.emit("show_dialog", index);
        }
      }}
    >
      <Image
        source={pic}
        style={{
          width: cardW,
          height: cardH - 40,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        resizeMode="contain"
      />
      <Text
          textBreakStrategy={"simple"}
        style={{
          color: "white",
          alignSelf: "center",
          marginTop: 10,
          fontSize: 15,
          fontWeight: "500",
        }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};
