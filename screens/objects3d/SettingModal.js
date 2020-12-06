import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
const icons = {
  cube: require("../../assets/cube.png"),
  box: require("../../assets/cube.png"),
  custom: require("../../assets/misc_shapes.png"),
  octahedron: require("../../assets/octahedron.png"),
  cone: require("../../assets/cone.png"),
  sphere: require("../../assets/sphere.png"),
  prism: require("../../assets/prism.png"),
};
import SingleShapeView from "./SingleShapeView";
import { loadTextVertex } from "../../components/helper/PointHelper";

const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state) => {
  return {
    basicComponents: state.basicComponents,
  };
};
const { height, width } = Dimensions.get("window");

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
function SettingScreen(props) {
  const [showShapeModal, setShowShapeModal] = useState(false);
  const [chosenShape, setChosenShape] = useState(null);
  const [chosenPoint, setChosenPoint] = useState(null);
  const [currentName, setCurrentName] = useState("");
  const [oldText, setOldText] = useState("");
  const [newTextGeo, setNewTextGeo] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 20, textAlignVertical: "center" }}>
          Advanced Settings
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={{ fontSize: 18 }}>All shapes</Text>
        <FlatList
          style={styles.flatList}
          showsVerticalScrollIndicator={false}
          keyExtractor={({ index, item }) => {
            return index + "shape";
          }}
          data={props.basicComponents.shapes}
          numColumns={2}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                ...styles.touchableItem,
              }}
              onPress={() => {
                setChosenShape(() => item);
                setShowShapeModal(() => true);
              }}
            >
              <Image
                source={icons[item.type]}
                style={{
                  width: width * 0.4,
                  height: height * 0.2,
                  tintColor: item.color,
                }}
                resizeMode="contain"
              />
              <View style={{ backgroundColor: "white", borderRadius: 5 }}>
                <Text style={{ textAlign: "center", paddingVertical: 5 }}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <Modal visible={showShapeModal} animationType="slide">
        <Modal
          visible={chosenPoint ? true : false}
          transparent={true}
          animationType="slide"
        >
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <View
              style={{
                width: width * 0.8,
                backgroundColor: "white",
                borderRadius: 5,
                padding: 10,
              }}
            >
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <Text style={{ marginTop: 5, marginRight: 5 }}>
                  Rename vertex:{" "}
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                    setCurrentName(() => text);
                  }}
                  value={currentName}
                />
              </View>
              <View
                style={{
                  marginTop: 15,
                  flexDirection: "row",
                  paddingVertical: 5,
                  justifyContent: "space-around",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: width * 0.37,
                    paddingVertical: 5,
                  }}
                  onPress={() => {
                    setChosenPoint(() => null);
                  }}
                >
                  <Text style={{ color: "red", textAlign: "center" }}>
                    CANCEL
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: width * 0.37,
                    paddingVertical: 5,
                  }}
                  onPress={() => {
                    const _oldText = chosenPoint.trueText;
                    setOldText(() => _oldText);
                    chosenPoint.trueText = currentName;
                    const _oldTextGeo = chosenPoint.text;
                    props.basicComponents.scene.remove(_oldTextGeo);
                    const _newTextGeo = loadTextVertex(chosenPoint);
                    chosenPoint.text = _newTextGeo;
                    props.basicComponents.scene.add(_newTextGeo);
                    props.basicComponents.points.map((item) => {
                      if (item.trueText === _oldText) {
                        return {
                          ...item,
                          trueText: currentName,
                          text: _newTextGeo,
                        };
                      }
                      return item;
                    });
                    setNewTextGeo(() => _newTextGeo);
                    setChosenPoint(() => null);
                  }}
                >
                  <Text style={{ color: "green", textAlign: "center" }}>
                    DONE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 10,
            backgroundColor: "white",
          }}
        >
          <TouchableOpacity
            style={styles.backModal}
            onPress={() => {
              setShowShapeModal(() => false);
              setNewTextGeo(() => null);
              setOldText(() => "");
              setChosenPoint(() => null);
              setChosenShape(() => null);
            }}
          >
            <Ionicons name="ios-arrow-round-back" color="black" size={42} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, marginLeft: 10, marginBottom: 10 }}>
            {chosenShape ? chosenShape.name : ""}
          </Text>
          <View style={{ flexDirection: "row", width: "100%", height: "30%" }}>
            <SingleShapeView
              shape={chosenShape ? chosenShape.object : null}
              edges={chosenShape ? chosenShape.edges : null}
              points={chosenShape ? chosenShape.points : null}
              newText={currentName}
              oldText={oldText}
              newTextGeo={newTextGeo}
            />
            <View style={{ width: "50%", marginLeft: 5, paddingHorizontal: 5 }}>
              <Text style={{ marginBottom: 5 }}>Assign vertices</Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                style={{
                  flex: 1,
                }}
                extraData={chosenShape ? chosenShape.points : null}
                keyExtractor={(item, index) => index + " vertex"}
                data={chosenShape ? chosenShape.points : []}
                renderItem={({ index, item }) => (
                  <TouchableOpacity
                    style={styles.vertex}
                    onPress={() => {
                      setChosenPoint(() => item);
                      setCurrentName(() => item.trueText);
                    }}
                  >
                    <Text>
                      {item.trueText} (x:{" "}
                      {Math.round(item.position.x * 100) / 100}, y:{" "}
                      {Math.round(item.position.y * 100) / 100}, z:{" "}
                      {Math.round(item.position.z * 100) / 100})
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginTop: 5,
              padding: 10,
              marginRight: 5,
            }}
          >
            <Text style={{ fontSize: 20 }}>Specs</Text>
            <View style={{ paddingLeft: 5, marginTop: 5 }}>
              <Text>Position</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.textItem}>
                  x: {chosenShape ? chosenShape.position.x : ""}
                </Text>
                <Text style={styles.textItem}>
                  y: {chosenShape ? chosenShape.position.y : ""}
                </Text>
                <Text style={styles.textItem}>
                  z: {chosenShape ? chosenShape.position.z : ""}
                </Text>
              </View>
              {chosenShape && chosenShape.rotation && (
                <View>
                  <Text>Rotation</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.textItem}>
                      x: {chosenShape ? chosenShape.rotation.x : ""}
                    </Text>
                    <Text style={styles.textItem}>
                      y: {chosenShape ? chosenShape.rotation.y : ""}
                    </Text>
                    <Text style={styles.textItem}>
                      z: {chosenShape ? chosenShape.rotation.z : ""}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginBottom: 50,
    flex: 1,
  },
  section: {
    marginTop: 10,
  },
  flatList: {
    paddingVertical: 5,
    marginBottom: 10
  },
  touchableItem: {
    borderRadius: 5,
    paddingTop: 5,
    borderWidth: StyleSheet.hairlineWidth,
    margin: 10,
    width: width / 2.5,
  },
  textItem: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  vertex: {
    backgroundColor: "#e7ff37",
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  backModal: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    marginRight: 10,
    width: width * 0.15,
    borderBottomColor: "#8a8a8a",
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 15,
  },
});
