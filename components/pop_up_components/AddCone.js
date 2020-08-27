import React, {useEffect, useState} from "react";
import {View, Text, Dimensions, FlatList} from "react-native";
import BasicShapeInput from './BasicShapeInput';

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

export default function AddCone({ returnShapes, mainScrollView }) {
    const [newCones, setNewCones] = useState([]);
    const getNewCone = (cone) => {
        if (cone != null) setNewCones(() => [...newCones, cone]);
        else setNewCones(() => []);
    };
    useEffect(() => {
        returnShapes(newCones);
    }, [newCones]);
  return (
    <View
      style={{
        width: SCREEN_WIDTH * 0.8,
        paddingLeft: 15,
        marginBottom: 10,
      }}
    >
        <Text style={{ marginTop: 5, marginBottom: 5 }}>New cones to add</Text>
        <FlatList
        style={{ marginLeft: 5, marginRight: 10, maxHeight: SCREEN_HEIGHT / 5 }}
        showsVerticalScrollIndicator={false}
        data={newCones}
        extraData={newCones}
        keyExtractor={(item) => `${item.id} box to add`}
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
                `: (x: ${Math.round(item.item.position.x * 100) / 100},y: ${
                    Math.round(item.item.position.y * 100) / 100
                },z: ${Math.round(item.item.position.z * 100) / 100}), (r: ${
                    item.item.sizes.radius
                },h: ${item.item.sizes.height})`}
            </Text>
        )}
    />
        <BasicShapeInput
            inputCallback={getNewCone}
            type={"cone"}
            mainScrollView={mainScrollView}
        />
    </View>
  );
}
