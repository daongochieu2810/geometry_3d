import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import AddBox from "./AddBox";
import AddSphere from "./AddSphere";
import AddCone from "./AddCone";
import AddCustom from "./AddCustom";
const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

const _basicShapes = [
  {
    id: 0,
    name: "Box",
    identity: "basic",
    chosen: false,
  },
  {
    id: 1,
    name: "Cone",
    identity: "basic",
    chosen: false,
  },
  {
    id: 2,
    name: "Sphere",
    identity: "basic",
    chosen: false,
  },
  {
    id: 3,
    name: "Custom",
    identity: "basic",
    chosen: false,
  },
];
const Options = ({ mainScrollView }) => {
  return (
    <View
      style={{
        width: SCREEN_WIDTH * 0.8,
        //alignContent: "center"
      }}
    >
      <FlatList
        data={_basicShapes}
        numColumns={2}
        style={{
          marginTop: 5,
          //width: SCREEN_WIDTH *0.7,
          alignSelf: "center",
        }}
        keyExtractor={(item) => `${item.id} basic shapes`}
        renderItem={({ index, item }) => (
          <TouchableOpacity
            style={styles.shapeOption}
            onPress={() => {
              mainScrollView.scrollTo({
                x: SCREEN_WIDTH * 0.8 * (item.id + 1),
                y: 0,
                animated: true,
              });
            }}
          >
            <Text style={{ textAlign: "center" }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
export default function ControlShapes({
  add,
  currShapes,
  returnShapes,
  currPoints,
}) {
  //var mainScrollView = useRef();
  const [mainScrollView, setMainScrollView] = useState(null);
  const [shapesRemove, setShapesRemove] = useState([]);
  const [shapes, setShapes] = useState(currShapes);

  useEffect(() => {
    if (!add) returnShapes(shapesRemove);
  }, [shapesRemove]);

  return (
    <View style={{ marginTop: 10 }}>
      <Text
        style={{
          textAlign: "center",
        }}
      >
        {add ? "Add Shapes" : "Remove Shapes"}
      </Text>
      {add && (
        <ScrollView
          ref={(ref) => setMainScrollView(() => ref)}
          snapToInterval={SCREEN_WIDTH * 0.8}
          decelerationRate="fast"
          horizontal
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          style={{
            marginBottom: 5,
          }}
        >
          <Options mainScrollView={mainScrollView} />
          <AddBox returnShapes={returnShapes} mainScrollView={mainScrollView} />
          <AddCone returnShapes={returnShapes} mainScrollView={mainScrollView} />
          <AddSphere
            returnShapes={returnShapes}
            mainScrollView={mainScrollView}
          />
          <AddCustom
            returnShapes={returnShapes}
            currentPoints={currPoints}
            mainScrollView={mainScrollView}
          />
        </ScrollView>
      )}
      {!add && (
        <View
          style={{
            paddingLeft: 15,
            marginBottom: 10,
          }}
        >
          <Text>Existing shapes</Text>
          <FlatList
            data={shapes}
            extraData={shapes}
            style={{
              marginTop: 5,
              maxHeight: SCREEN_HEIGHT / 4,
            }}
            keyExtractor={(item) => `${item.id} existing shape`}
            renderItem={({ index, item }) => (
              <TouchableOpacity
                style={{
                  borderWidth: StyleSheet.hairlineWidth,
                  borderRadius: 5,
                  padding: 5,
                  marginRight: 10,
                  marginBottom: 5,
                  flexDirection: "row",
                }}
                onPress={() => {
                  setShapesRemove(() => [...shapesRemove, item]);
                  setShapes(() =>
                    shapes.filter((shape) => shape.id != item.id)
                  );
                }}
              >
                <View
                  style={{ ...styles.circle, backgroundColor: item.color }}
                ></View>
                <Text style={{ textAlignVertical: "center", marginLeft: 5 }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
          <Text style={{ marginTop: 10 }}>Shapes to remove</Text>
          <FlatList
            data={shapesRemove}
            extraData={shapesRemove}
            style={{
              marginTop: 5,
              maxHeight: SCREEN_HEIGHT / 4,
            }}
            keyExtractor={(item) => `${item.id} to remove`}
            renderItem={({ index, item }) => (
              <TouchableOpacity
                style={{
                  borderWidth: StyleSheet.hairlineWidth,
                  borderRadius: 5,
                  padding: 5,
                  marginRight: 10,
                  flexDirection: "row",
                  marginBottom: 5,
                }}
                onPress={() => {
                  setShapes(() => [...shapes, item]);
                  setShapesRemove(() =>
                    shapesRemove.filter((shape) => shape.id != item.id)
                  );
                }}
              >
                <View
                  style={{ ...styles.circle, backgroundColor: item.color }}
                ></View>
                <Text style={{ textAlignVertical: "center", marginLeft: 5 }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  input: {
    marginRight: 10,
    width: SCREEN_WIDTH * 0.15,
    borderBottomColor: "#8a8a8a",
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 15,
  },
  shapeOption: {
    width: SCREEN_WIDTH * 0.3,
    height: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    margin: 5,
    justifyContent: "center",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
