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
export default function AddBox({ returnShapes, mainScrollView }) {
  const [newBoxes, setNewBoxes] = useState([]);
  const getNewShape = (newShape) => {
    if (newShape != null) setNewBoxes(() => [...newBoxes, newShape]);
    else setNewBoxes(() => []);
  };
  useEffect(() => {
    if (newBoxes.length > 0) returnShapes(newBoxes);
  }, [newBoxes]);
  return (
    <View
      style={{
        width: SCREEN_WIDTH * 0.8,
        paddingLeft: 15,
        marginBottom: 10,
      }}
    >
      <Text style={{ marginTop: 5, marginBottom: 5 }}>New boxes to add</Text>

      <FlatList
        style={{ marginLeft: 5, marginRight: 10, maxHeight: SCREEN_HEIGHT / 5 }}
        showsVerticalScrollIndicator={false}
        data={newBoxes}
        extraData={newBoxes}
        keyExtractor={(item) => `${item.id} box to add`}
        renderItem={({ index, item }) => (
          /*  <Tooltip
            popover={
              <Text
                style={{ color: "white" }}
              >{`x: ${item.item.position.x},y: ${item.item.position.y},z: ${item.item.position.z}\nw: ${item.item.sizes.width},h: ${item.item.sizes.height},d: ${item.item.sizes.depth}`}</Text>
            }
            withOverlay={false}
            backgroundColor="black"
          >*/
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
              `: (x: ${Math.round(item.item.position.x * 100) / 100},y: ${
                Math.round(item.item.position.y * 100) / 100
              },z: ${Math.round(item.item.position.z * 100) / 100}), (w: ${
                item.item.sizes.width
              },h: ${item.item.sizes.height},d: ${item.item.sizes.depth})`}
          </Text>
          // </Tooltip>
        )}
      />
      <BasicShapeInput
        inputCallback={getNewShape}
        type={"box"}
        mainScrollView={mainScrollView}
      />
    </View>
  );
}
