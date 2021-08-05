import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  BackHandler,
  SafeAreaView,
  Modal,
  ScrollView,
} from "react-native";

import { useNavigation } from "react-navigation-hooks";
import { Ionicons } from "@expo/vector-icons";
import { NavigationActions } from "react-navigation";
import * as THREE from "three";
import MenuDrawer from "react-native-side-drawer";
import LayoutSetup from "./objects3d/LayoutSetup";
import Dialog, {
  SlideAnimation,
  DialogButton,
  DialogFooter,
} from "react-native-popup-dialog";
import ControlPoints from "../components/pop_up_components/ControlPoints";
import ControlShapes from "../components/pop_up_components/ControlShapes";
import EditPoints from "../components/pop_up_components/EditPoints";
import CameraSettings from "../components/pop_up_components/CameraSettings";
import Toast from "react-native-toast-message";
import SettingModal from "./objects3d/SettingModal";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function BaseLayoutScreen(props) {
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", () => true);
  }, []);
  const initShape = props.initShape;
  const params = props.params;
  THREE.suppressExpoWarnings(true);
  let savedState = null;
  if (params) {
    let currSavedState = {
      shapes: params.shapes,
      lines: params.lines,
      points: params.points,
      fileName: params.fileName,
    };
    savedState = currSavedState;
  }
  const [currPoints, setCurrPoints] = useState(null);
  const [currLines, setCurrLines] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [popUpComp, setPopUpComp] = useState(null);
  const [pointsConnect, setPointsConnect] = useState([]);

  const [signalPoints, setSignalPoints] = useState(false);
  const [signalShapes, setSignalShapes] = useState(false);
  const [signalEditPoints, setSignalEditPoints] = useState(false);

  const [action, setAction] = useState("");
  const [currShapes, setCurrShapes] = useState(null);
  const [shapesConnect, setShapesConnect] = useState([]);
  const [isFromShape, setIsFromShape] = useState(false);
  const [pointsEdit, setPointsEdit] = useState(null);

  const [showSettings, setShowSettings] = useState(false);

  const [camera, setCamera] = useState(null);

  const navigate = useNavigation();
  const getCam = (cam) => {
    setCamera(() => cam);
  };
  const getPoints = (listOfPoints) => {
    setCurrPoints(() => listOfPoints);
  };
  const getLines = (listOfLines) => {
    setCurrLines(() => listOfLines);
  };
  const getShapes = (listOfShapes) => {
    setCurrShapes(() => listOfShapes);
  };
  const connectPoints = (pointsToConnect) => {
    //setIsFromShape(() => false);
    setPointsConnect(() => pointsToConnect);
  };
  const connectShapes = (shapesToConnect) => {
    //setIsFromShape(() => true);
    setShapesConnect(() => shapesToConnect);
  };
  const editPoints = (pointsToEdit) => {
    //console.log(pointsToEdit.length);
    setPointsEdit(() => pointsToEdit);
  };
  const actions = [
    {
      text: "Add points",
      icon: require("../assets/cube.png"),
      name: "add_points",
      position: 1,
    },
    {
      text: "Remove points",
      icon: require("../assets/sphere.png"),
      name: "remove_points",
      position: 2,
    },
    {
      text: "Connect points",
      icon: require("../assets/cone.png"),
      name: "connect_points",
      position: 3,
    },
    {
      text: "Disconnect points",
      icon: require("../assets/octahedron.png"),
      name: "disconnect_points",
      position: 4,
    },
    {
      text: "Add shapes",
      icon: require("../assets/add_shape.png"),
      name: "add_shapes",
      position: 5,
    },
    {
      text: "Remove shapes",
      icon: require("../assets/more.png"),
      name: "remove_shapes",
      position: 6,
    },
    {
      text: "Settings",
      icon: require("../assets/misc_shapes.png"),
      name: "settings",
      position: 7,
    },
    {
      text: "Advanced settings",
      icon: require("../assets/connect_points.png"),
      name: "advanced_settings",
      position: 8,
    },
  ];
  const cards = {
    add_points: {
      component: (
        <EditPoints
          isAdd={true}
          currentPoints={currPoints ? currPoints : []}
          returnPoints={editPoints}
        />
      ),
      action: "add_points",
    },
    remove_points: {
      component: (
        <EditPoints
          isAdd={false}
          currentPoints={currPoints ? currPoints : []}
          returnPoints={editPoints}
        />
      ),
      action: "remove_points",
    },
    connect_points: {
      component: (
        <ControlPoints
          connect={true}
          currentPoints={currPoints ? currPoints : []}
          returnPoints={connectPoints}
        />
      ),
      action: "connect_points",
    },
    disconnect_points: {
      component: (
        <ControlPoints
          connect={false}
          currentPoints={currLines ? currLines : []}
          returnPoints={connectPoints}
        />
      ),
      action: "disconnect_points",
    },
    add_shapes: {
      component: (
        <ControlShapes
          add={true}
          currShapes={currShapes ? currShapes : []}
          returnShapes={connectShapes}
          currPoints={currPoints ? currPoints : []}
        />
      ),
      action: "add_shapes",
    },
    remove_shapes: {
      component: (
        <ControlShapes
          add={false}
          currShapes={currShapes ? currShapes : []}
          returnShapes={connectShapes}
          currPoints={[]}
        />
      ),
      action: "remove_shapes",
    },
    settings: {
      component: (
        <CameraSettings
          existingShapes={currShapes ? currShapes : []}
          camera={camera}
        />
      ),
      action: "settings",
    },
    advanced_settings: {
      component: null,
      action: "advanced_settings",
    },
  };
  const onPointsEditPopUpDone = () => {
    if (pointsEdit.length > 0) {
      setSignalEditPoints(() => !signalEditPoints);
      if (action === "add_points") {
        Toast.show({
          type: "success",
          position: "top",
          text1: `${pointsEdit.length} point(s) added`,
          text2: "Success",
          visibilityTime: 3000,
          autoHide: true,
        });
      } else if (action === "remove_points") {
        Toast.show({
          type: "success",
          position: "top",
          text1: `${pointsEdit.length} point(s) removed`,
          text2: "Success",
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Not enough data",
        text2: "Please try again",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };
  const onPointsPopUpDone = () => {
    if (pointsConnect.length >= 1 && action === "disconnect_points") {
      setSignalPoints(() => !signalPoints);
      Toast.show({
        type: "success",
        position: "top",
        text1: `${pointsConnect.length} line(s) disconnected`,
        text2: "Success",
        visibilityTime: 3000,
        autoHide: true,
      });
    } else if (pointsConnect.length <= 1) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Not enough data",
        text2: "Please try again",
        visibilityTime: 3000,
        autoHide: true,
      });
    } else {
      setSignalPoints(() => !signalPoints);
      Toast.show({
        type: "success",
        position: "top",
        text1: `${pointsConnect.length} points connected`,
        text2: "Success",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
    //setPointsConnect(() => []);
  };
  const onShapesPopUpDone = () => {
    if (shapesConnect.length === 0) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Not enough data",
        text2: "Please try again",
        visibilityTime: 3000,
        autoHide: true,
      });
    } else {
      setSignalShapes(() => !signalShapes);
      Toast.show({
        type: "success",
        position: "top",
        text1: `${shapesConnect.length} shape(s) ${
          action === "add_shapes" ? "added" : "removed"
        }`,
        text2: "Success",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
    //setShapesConnect(() => []);
  };
  const drawerContent = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            width: SCREEN_WIDTH * 0.8 - 40,
            height: "100%",
            backgroundColor: "white",
          }}
        >
          <FlatList
            style={{
              marginHorizontal: 10,
              marginVertical: 5,
            }}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item, index) => `${index} side drawer`}
            showsVerticalScrollIndicator={false}
            data={actions}
            renderItem={({ index, item }) => (
              <TouchableOpacity
                key={index}
                style={{
                  alignContent: "center",
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 10,
                  margin: 5,
                  marginBottom: index === actions.length - 1 ? 50 : 5,
                }}
                onPress={() => {
                  const card = cards[item.name];
                  if (item.name === "settings") {
                  } else if (
                    item.name === "add_shapes" ||
                    item.name === "remove_shapes"
                  ) {
                    setIsFromShape(() => true);
                  } else {
                    setIsFromShape(() => false);
                  }
                  if (item.name === "advanced_settings") {
                    setShowSettings(() => true);
                    return;
                  }
                  setVisible(true);
                  setPointsConnect(() => []);
                  setAction(() => item.name);
                  setPopUpComp(card.component);
                }}
              >
                <Text
                  style={{
                    color: "black",
                  }}
                >
                  {item.text}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <TouchableOpacity
          onPress={() => setIsMenuOpen(false)}
          style={{
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            height: 40,
            width: 40,
            position: "absolute",
            right: 0,
            top: SCREEN_HEIGHT / 2 - 50,
            backgroundColor: "white",
          }}
        >
          <Ionicons name="ios-arrow-back" size={25} color="black" />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <MenuDrawer
        open={isMenuOpen}
        drawerContent={drawerContent()}
        drawerPercentage={80}
        animationTime={100}
        overlay={true}
      >
        <TouchableOpacity
          style={{
            zIndex: 2,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            height: 40,
            width: 40,
            position: "absolute",
            left: 0,
            top: SCREEN_HEIGHT / 2 - 50,
            backgroundColor: "white",
          }}
          onPress={() => {
            setIsMenuOpen(true);
          }}
        >
          <Ionicons name="ios-arrow-forward" size={25} color="black" />
        </TouchableOpacity>
        <LayoutSetup
          getPointsCallback={getPoints}
          getLinesCallback={getLines}
          getShapesCallback={getShapes}
          getCam={getCam}
          pointsConnect={pointsConnect}
          shapesConnect={shapesConnect}
          pointsEdit={pointsEdit}
          signalPoints={signalPoints}
          signalShapes={signalShapes}
          signalEditPoints={signalEditPoints}
          action={action}
          savedState={savedState}
          initShape={initShape}
        />

        <Dialog
          visible={visible}
          dialogAnimation={
            new SlideAnimation({
              slideFrom: "bottom",
            })
          }
          width={SCREEN_WIDTH * 0.8}
          onHardwareBackPress={() => true}
          footer={
            <DialogFooter>
              <DialogButton
                text="CANCEL"
                onPress={() => {
                  setVisible(false);
                  setPopUpComp(null);
                }}
                textStyle={{
                  fontSize: 15,
                  color: "red",
                }}
              />
              <DialogButton
                text="DONE"
                onPress={() => {
                  setVisible(false);
                  if (!isFromShape) {
                    if (action === "settings") {
                    } else if (
                      (action === "remove_points" || action === "add_points") &&
                      pointsEdit
                    )
                      onPointsEditPopUpDone();
                    else if (pointsConnect) onPointsPopUpDone();
                  } else {
                    if (shapesConnect) onShapesPopUpDone();
                  }
                  setPopUpComp(null);
                }}
                textStyle={{
                  fontSize: 15,
                  color: "green",
                }}
              />
            </DialogFooter>
          }
        >
          {popUpComp}
        </Dialog>
        <TouchableOpacity
          style={styles.back}
          onPress={() =>
            navigate.navigate(
              "App",
              {},
              NavigationActions.navigate({
                routeName: params ? "Items" : "Home",
              })
            )
          }
        >
          <Ionicons name="ios-arrow-round-back" color="white" size={42} />
        </TouchableOpacity>

        <Modal visible={showSettings} animationType="slide">
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
                setShowSettings(() => false);
              }}
            >
              <Ionicons name="ios-arrow-round-back" color="black" size={42} />
            </TouchableOpacity>
            <SettingModal currShapes={currShapes} currPoints={currPoints} />
          </View>
        </Modal>
      </MenuDrawer>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  back: {
    position: "absolute",
    top: 20,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  backModal: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
