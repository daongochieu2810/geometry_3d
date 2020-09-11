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
} from "react-native";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
const icons = {
  cube: require("../../assets/cube.png"),
  custom: require("../../assets/misc_shapes.png"),
  octahedron: require("../../assets/octahedron.png"),
  cone: require("../../assets/cone.png"),
  sphere: require("../../assets/sphere.png"),
  prism: require("../../assets/prism.png"),
};
import SingleShapeView from "./SingleShapeView";

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
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={({ index, item }) => {
            return index + "shape";
          }}
          data={props.basicComponents.shapes}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ ...styles.touchableItem }}
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
            />
            <View style={{ width: "50%", marginLeft: 5, paddingHorizontal: 5 }}>
              <Text style={{ marginBottom: 5 }}>Assign vertices</Text>
              <FlatList
                style={{
                  height: "100%",
                  borderWidth: 1,
                  borderColor: "black",
                }}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginTop: 10,
              padding: 10,
              marginRight: 5,
              borderWidth: 1,
              borderColor: "black",
            }}
          >
            <Text style={{fontSize: 20}}>Specs</Text>
            <View style={{paddingLeft: 5, marginTop: 5}}>
              <Text>Position</Text>
              <Text>Rotation</Text>
              <Text>Sizes</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  section: {
    marginTop: 10,
  },
  flatList: {
    paddingVertical: 10,
  },
  touchableItem: {
    borderRadius: 5,
    paddingTop: 5,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 10,
  },
  backModal: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
