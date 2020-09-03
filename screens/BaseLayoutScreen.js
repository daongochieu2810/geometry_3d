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
} from "react-native";

import { useNavigation } from "react-navigation-hooks";
import { Ionicons } from "@expo/vector-icons";
import { NavigationActions } from "react-navigation";
import * as THREE from "three";
import BottomDrawer from "rn-bottom-drawer";
import LayoutSetup from "./objects3d/LayoutSetup";
import Dialog, {
  SlideAnimation,
  DialogButton,
  DialogFooter,
} from "react-native-popup-dialog";
import ControlPoints from "../components/pop_up_components/ControlPoints";
import ControlShapes from "../components/pop_up_components/ControlShapes";
import EditPoints from "../components/pop_up_components/EditPoints";
import Settings from "../components/pop_up_components/Settings";
import Toast from "react-native-toast-message";

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
  const cards = [
    {
      index: 0,
      name: "Add points",
      component: (
        <EditPoints
          isAdd={true}
          currentPoints={currPoints ? currPoints : []}
          returnPoints={editPoints}
        />
      ),
      action: "add_points",
    },
    {
      index: 1,
      name: "Remove points",
      component: (
        <EditPoints
          isAdd={false}
          currentPoints={currPoints ? currPoints : []}
          returnPoints={editPoints}
        />
      ),
      action: "remove_points",
    },
    {
      index: 2,
      name: "Connect Points",
      component: (
        <ControlPoints
          connect={true}
          currentPoints={currPoints ? currPoints : []}
          returnPoints={connectPoints}
        />
      ),
      action: "connect_points",
    },
    {
      index: 3,
      name: "Disconnect Points",
      component: (
        <ControlPoints
          connect={false}
          currentPoints={currLines ? currLines : []}
          returnPoints={connectPoints}
        />
      ),
      action: "disconnect_points",
    },
    {
      index: 4,
      name: "Add Shapes",
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
    {
      index: 5,
      name: "Remove Shapes",
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
    {
      index: 6,
      name: "Settings",
      component: <Settings existingShapes={currShapes} camera={camera} />,
      action: "settings",
    },
  ];
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
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
                    navigate.navigate("SettingScreen");
                    return;
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
            NavigationActions.navigate({ routeName: params ? "Items" : "Home" })
          )
        }
      >
        <Ionicons name="ios-arrow-round-back" color="white" size={42} />
      </TouchableOpacity>

      <BottomDrawer
        containerHeight={SCREEN_HEIGHT / 5}
        offset={0}
        startUp={false}
        downDisplay={SCREEN_HEIGHT / 6.5}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
          }}
        >
          <Text style={{ textAlign: "center", marginTop: SCREEN_HEIGHT / 100 }}>
            Tools
          </Text>
          <FlatList
            style={{
              marginHorizontal: 10,
              marginVertical: 5,
            }}
            horizontal={true}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item, index) => `${index} bottom drawer`}
            showsHorizontalScrollIndicator={false}
            data={cards}
            renderItem={({ index, item }) => (
              <TouchableOpacity
                key={index}
                style={{
                  alignContent: "center",
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 10,
                  margin: 5,
                }}
                onPress={() => {
                  if (
                    item.action === "add_shapes" ||
                    item.action === "remove_shapes"
                  ) {
                    setIsFromShape(() => true);
                  } else {
                    setIsFromShape(() => false);
                  }
                  if (item.action === "settings") {
                    navigate.navigate("SettingScreen");
                    return;
                  }
                  setVisible(true);
                  setPointsConnect(() => []); 
                  setAction(() => item.action);
                  setPopUpComp(item.component);
                }}
              >
                <Text
                  style={{
                    color: "black",
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </BottomDrawer>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  back: {
    position: "absolute",
    top: 32,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});
