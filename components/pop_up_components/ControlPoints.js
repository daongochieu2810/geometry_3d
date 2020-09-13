import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as THREE from "three";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;
export default function ControlPoints({
  currentPoints,
  returnPoints,
  connect,
}) {
  let _pointInput = currentPoints.map((item, index) => ({
    item: item,
    id: index,
    chosen: false,
    isNew: false,
  }));
  const [pointInput, setPointInput] = useState(_pointInput);

  const [pointPairs, setPointPairs] = useState([]);
  const [newPoints, setNewPoints] = useState([]);
 

  useEffect(() => {
    returnPoints(pointPairs);
  }, [pointPairs]);

  index = 0;
  return (
    <View
      style={{
        marginTop: 10,
        marginLeft: 15,
        marginBottom: 15,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          marginBottom: 5,
        }}
      >
        {connect ? "Connect" : "Disconnect"} Points
      </Text>
      <Text>Existing {connect ? "Points" : "Lines"}</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          maxHeight: SCREEN_HEIGHT / 4,
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
              {item.item.text}{" "}
              {connect
                ? `(x: ${Math.round(item.item.point.x * 100) / 100}, y: ${Math.round(item.item.point.y * 100) / 100},z: ${Math.round(item.item.point.z * 100) / 100})`
                : ""}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Text style={{ marginTop: 5 }}>
        Points to {connect ? "connect (left to right)" : "disconnect"}
      </Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        extraData={pointPairs}
        data={pointPairs}
        keyboardShouldPersistTaps="handled"
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
      {newPoints.length > 0 && (
        <>
          <Text style={{ marginTop: 5 }}>Newly added points</Text>
          <FlatList
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            extraData={newPoints}
            data={newPoints}
            keyExtractor={(item) => `${item.id} new`}
            renderItem={({ index, item }) => (
              <TouchableOpacity
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  backgroundColor: item.chosen ? "#ff481f" : "#71eb34",
                  borderRadius: 5,
                  margin: 5,
                }}
                onPress={() => {
                  newPoints[index].chosen = !newPoints[index].chosen;
                  //if (isMounted) {
                  setNewPoints(() => [...newPoints]);
                  if (newPoints[index].chosen) {
                    setPointPairs(() => [...pointPairs, newPoints[index]]);
                  } else {
                    setPointPairs(() =>
                      pointPairs.filter((point) => point.id != item.id)
                    );
                  }
                  //}
                }}
              >
                <Text>{item.item.text}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
}

