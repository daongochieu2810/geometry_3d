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
export default function AddCustom({
  returnShapes,
  currentPoints,
  mainScrollView,
}) {
  var _pointInput = currentPoints.map((item, index) => ({
    item: item,
    id: index,
    chosen: false,
    isNew: false,
  }));
  const [pointInput, setPointInput] = useState(_pointInput);
  const [pointPairs, setPointPairs] = useState([]);
  const [newCustoms, setNewCustoms] = useState([]);
  const [error, setError] = useState(null);
  const getNewShape = (newShape) => {
    if (newShape != null) {
      if (pointPairs.length <= 3) {
        setError(() => "Not enough points");
        return;
      }
      newShape.item.points = pointPairs.map((item) => item.item.point);
      //console.log(newShape)
      setNewCustoms(() => [...newCustoms, newShape]);
    } else setNewCustoms(() => []);
    //setPointPairs(() => []);
    pointInput.forEach((item) => {
      item.chosen = false;
    });
  };
  useEffect(() => {
      setError(() => null);
      returnShapes(newCustoms);
  }, [newCustoms]);

  return (
    <View
      style={{
        width: SCREEN_WIDTH * 0.8,
        paddingLeft: 15,
        marginBottom: 10,
      }}
    >
      <Text style={{ marginTop: 5, marginBottom: 5 }}>
        New custom shapes to add
      </Text>
      <FlatList
        style={{ marginLeft: 5, marginRight: 10, maxHeight: SCREEN_HEIGHT / 4 }}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={newCustoms}
        extraData={newCustoms}
        keyExtractor={(item) => `${item.id} shape to add`}
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
            {item.item.name}
          </Text>
        )}
      />
      <Text>Existing points</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        //showsHorizontalScrollIndicator={false}
        //horizontal={true}
        style={{
          maxHeight: SCREEN_HEIGHT / 5,
        }}
        extraData={pointInput}
        data={pointInput}
        keyExtractor={(item) => `${item.id} existing`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
              backgroundColor: item.chosen ? "#ff481f" : "#71eb34",
              borderRadius: 5,
              margin: 5,
              alignSelf: "baseline",
            }}
            onPress={() => {
              pointInput[item.id].chosen = !pointInput[item.id].chosen;
              //if (isMounted) {
              if (pointInput[item.id].chosen) {
                setPointPairs(() => [...pointPairs, pointInput[item.id]]);
              } else {
                setPointPairs(() =>
                  pointPairs.filter((point) => point.id != item.id)
                );
              }
              setPointInput(() => [...pointInput]);
              //}
            }}
          >
            <Text>
              {item.item.text +
                `(x: ${Math.round(item.item.point.x * 100) / 100}, y: ${Math.round(item.item.point.y * 100) / 100},z: ${Math.round(item.item.point.z * 100) / 100})`}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Text style={{ marginTop: 5 }}>Custom shape's vertices</Text>
      <FlatList
        style={{
          marginRight: 10,
        }}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        extraData={pointPairs}
        data={pointPairs}
        keyExtractor={(item) => `${item.id} chosen`}
        renderItem={({ index, item }) => (
          <TouchableOpacity
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
              backgroundColor: "#ffc117",
              borderRadius: 5,
              margin: 5,
            }}
            onPress={() => {}}
          >
            <Text>{item.item.text}</Text>
          </TouchableOpacity>
        )}
      />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <BasicShapeInput
        inputCallback={getNewShape}
        type={"custom"}
        mainScrollView={mainScrollView}
      />
    </View>
  );
}
