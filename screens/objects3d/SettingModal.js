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
          <Text style={{fontSize: 20, marginLeft: 10}}>{chosenShape ? chosenShape.name : ""}</Text>
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
