import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
} from "react-native";
//import { Tooltip } from "react-native-elements";
import BasicShapeInput from "./BasicShapeInput";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;
export default function AddSphere({ returnShapes, mainScrollView }) {
  const [newSpheres, setNewSpheres] = useState([]);
  const getNewShape = (newShape) => {
    if (newShape != null) setNewSpheres(() => [...newSpheres, newShape]);
    else setNewSpheres(() => []);
  };
  useEffect(() => {
    if (newSpheres.length > 0) returnShapes(newSpheres);
  }, [newSpheres]);
  return (
    <View
      style={{
        width: SCREEN_WIDTH * 0.8,
        paddingLeft: 15,
        marginBottom: 10,
      }}
    >
      <Text style={{ marginTop: 5, marginBottom: 5 }}>New spheres to add</Text>

      <FlatList
        style={{ marginLeft: 5, marginRight: 10, maxHeight: SCREEN_HEIGHT / 5 }}
        showsVerticalScrollIndicator={false}
        data={newSpheres}
        extraData={newSpheres}
        keyExtractor={(item) => `${item.id} sphere to add`}
        renderItem={({ index, item }) => (
          <Text
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
              backgroundColor: item.item.color ? item.item.color : "#71eb34",
              marginBottom: 5,
              alignSelf: "baseline",
            }}
          >
            {item.item.name +
              `: (x: ${item.item.position.x},y: ${item.item.position.y},z: ${item.item.position.z}), (r: ${item.item.sizes.radius})`}
          </Text>
        )}
      />
      <BasicShapeInput
        inputCallback={getNewShape}
        type={"sphere"}
        mainScrollView={mainScrollView}
      />
    </View>
  );
}
