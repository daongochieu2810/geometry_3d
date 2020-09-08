import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;
const axesLayout = [
  {
    id: 0,
    name: "yUp",
    pic: require("../../assets/yUp.png"),
    x: 0,
    y: 1,
    z: 0,
  },
  {
    id: 1,
    name: "zUp",
    pic: require("../../assets/zUp.png"),
    x: 0,
    y: 0,
    z: 1,
  },
];
export default function Settings({ existingShapes, camera }) {
  let _shapesInput = existingShapes.map((item, index) => ({
    item: item,
    id: index,
    chosen: false,
  }));
  const [shapesInput, setShapesInput] = useState(_shapesInput);
  return (
    <View
      style={{
        marginTop: 10,
        marginLeft: 15,
        marginBottom: 15,
      }}
    >
      <Text style={styles.title}>Camera Settings</Text>
      <Text style={{ marginTop: 5 }}>Camera perspective</Text>
      <FlatList
        data={shapesInput}
        extraData={shapesInput}
        style={{
          marginTop: 5,
          maxHeight: SCREEN_HEIGHT / 4,
        }}
        keyExtractor={(item) => `${item.id} to set`}
        renderItem={({ index, item }) => (
          <TouchableOpacity
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              borderRadius: 5,
              padding: 5,
              marginRight: 10,
              flexDirection: "row",
              marginBottom: 5,
              backgroundColor: item.chosen ? "black" : "white",
            }}
            onPress={() => {
              if (item.item.position) camera.setCenter(item.item.position);
              else camera.setCenter({ x: 0, y: 0, z: 0 });
              shapesInput[item.id].chosen = !shapesInput[item.id].chosen;
              setShapesInput(() =>
                shapesInput.map((_item) => {
                  if (_item.id !== item.id) {
                    _item.chosen = false;
                  }
                  return _item;
                })
              );
            }}
          >
            <View
              style={{ ...styles.circle, backgroundColor: item.item.color }}
            />
            <Text
              style={{
                textAlignVertical: "center",
                marginLeft: 5,
                color: item.chosen ? "white" : "black",
              }}
            >
              {item.item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Text>Camera sensitivity</Text>
      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={-4}
        maximumValue={5}
        minimumTrackTintColor="#45b8ff"
        maximumTrackTintColor="#21de21"
        thumbTintColor="#2be1fc"
        value={
          camera.sensitivity >= 1 ? camera.sensitivity : -1 / camera.sensitivity
        }
        onValueChange={(value) => {
          if (value <= 0) {
            camera.setSensitivity(-1 / (value - 2));
          } else {
            camera.setSensitivity(value);
          }
        }}
        step={1}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
  },
  axesCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    padding: 5,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 5,
    marginRight: 10,
  },
});
