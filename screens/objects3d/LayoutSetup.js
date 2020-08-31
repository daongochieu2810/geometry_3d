import React, { useState, useEffect } from "react";
import {
  View,
  PanResponder,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Vibration,
} from "react-native";
import UniCameraHandler from "./UniCameraHandler";
import ExpoTHREE from "expo-three";
global.Image = undefined;
import ExpoGraphics from "expo-graphics";
import * as THREE from "three";
import { connect } from "react-redux";
import actions from "../../actions";
import {
  getVerticesWithText,
  addShapes,
  removeShapes,
  loadSavedState,
} from "../../components/helper/ShapeHelper";
import {
  addPoints,
  removePoints,
  connectPoints,
  disconnectPoints,
} from "../../components/helper/PointHelper";
import { ConvexBufferGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import Toast from "react-native-toast-message";
import DragControls from "../../components/helper/DragControls";
import { formatDateTime } from "../../components/helper/DatabaseHelper";
import Shape from "./Shape";

const mapDispatchToProps = (dispatch) => {
  return {
    reduxSetBasicComponents: (components) => {
      dispatch(actions.setCamera(components.camera));
      dispatch(actions.setCameraHandler(components.cameraHandler));
      dispatch(actions.setRenderer(components.renderer));
      dispatch(actions.setScene(components.scene));
    },
    reduxSetPoint: (points) => {
      dispatch(actions.setPoints(points));
    },
    reduxAddLine: (line) => {
      dispatch(actions.addLine(line));
    },
    reduxRemoveLine: (line) => {
      dispatch(actions.removeLine(line));
    },
    reduxSetLine: (lines) => {
      dispatch(actions.setLines(lines));
    },
    reduxAddShape: (shape) => {
      dispatch(actions.addShape(shape));
    },
    reduxRemoveShape: (shape) => {
      dispatch(actions.removeShape(shape));
    },
    reduxSetShape: (shapes) => {
      dispatch(actions.setShapes(shapes));
    },
    reduxAddSaveItem: (item) => {
      dispatch(actions.addSaveItem(item));
    },
    reduxSetSaveItem: (items) => {
      dispatch(actions.setSaveItem(items));
    },
    reduxSetDisableCamera: (isDisabled) => {
      dispatch(actions.setDisableCamera(isDisabled));
    },
    reduxSetControls: (controls) => {
      dispatch(actions.setControls(controls));
    },
  };
};
const mapStateToProps = (state) => {
  return {
    basicComponents: state.basicComponents,
    saveComponents: state.saveComponents,
    miscData: state.miscData,
  };
};
const { height, width } = Dimensions.get("window");

export default connect(mapStateToProps, mapDispatchToProps)(LayoutSetup);
function LayoutSetup(props) {
  const raw_font = require("../../assets/fonts/bebas_neue.typeface.json");
  const font = new THREE.Font(raw_font);
  const [pan, setPan] = useState(new Animated.ValueXY());
  const [mouse, setMouse] = useState(new THREE.Vector2(-10, -10));
  const [val, setVal] = useState({ x: 0, y: 0 });
  const [isLock, setIsLock] = useState(false);
  const _transformEvent = (event) => {
    event.preventDefault = event.preventDefault || (() => {});
    event.stopPropagation = event.stopPropagation || (() => {});
    return event;
  };

  //Should we become active when the user presses down on the square?
  const handleStartShouldSetPanResponder = () => {
    return true;
  };

  // We were granted responder status! Let's update the UI
  const handlePanResponderGrant = (e, gestureState) => {
    const event = _transformEvent({ ...e, gestureState });
    const disableCamera = props.miscData.disableCamera;
    if (disableCamera) {
      pan.setOffset({
        x: val.x,
        y: val.y,
      });
      pan.setValue({ x: -10, y: -10 });
      mouse.x = (event.nativeEvent.pageX / width) * 2 - 1;
      mouse.y = -(event.nativeEvent.pageY / height) * 2 + 1;
      //props.basicComponents.controls.onDocumentTouchStart(mouse);
    }
    if (!disableCamera)
      props.basicComponents.cameraHandler.handlePanResponderGrant(
        event.nativeEvent
      );
  };

  // Every time the touch/mouse moves
  const handlePanResponderMove = (e, gestureState) => {
    // Keep track of how far we've moved in total (dx and dy)
    const event = _transformEvent({ ...e, gestureState });
    const disableCamera = props.miscData.disableCamera;
    if (disableCamera) {
      mouse.x = (event.nativeEvent.pageX / width) * 2 - 1;
      mouse.y = -(event.nativeEvent.pageY / height) * 2 + 1;
      //props.basicComponents.controls.onDocumentMouseMove(mouse);
    }
    if (!disableCamera)
      props.basicComponents.cameraHandler.handlePanResponderMove(
        event.nativeEvent,
        gestureState
      );
  };

  // When the touch/mouse is lifted
  const handlePanResponderEnd = (e, gestureState) => {
    const event = _transformEvent({ ...e, gestureState });
    //clearTimeout(longPressTimeout);
    const disableCamera = props.miscData.disableCamera;
    if (disableCamera) {
      mouse.x = -10;
      mouse.y = -10;
      //props.basicComponents.controls.onDocumentMouseCancel();
    }
    if (!disableCamera)
      props.basicComponents.cameraHandler.handlePanResponderEnd(
        event.nativeEvent
      );
  };

  pan.addListener((value) => setVal(() => value));
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: handleStartShouldSetPanResponder,
    onPanResponderGrant: handlePanResponderGrant,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderEnd,
    onPanResponderTerminate: handlePanResponderEnd,
    onShouldBlockNativeResponder: () => false,
    onPanResponderTerminationRequest: () => true,
  });
  const updatePoints = () => {
    if (props.basicComponents.points != null) {
      props.getPointsCallback(
        props.basicComponents.points.map((item) => {
          return {
            point: item.position,
            text: item.trueText,
            item: item,
          };
        })
      );
    }
  }; //, [props.basicComponents.points]);
  const loadFont = (listOfVertices) => {
    let listOfObjects = [];
    for (let item of listOfVertices) {
      const vertex = item.point;
      const textGeo = new THREE.TextGeometry(item.text, {
        font: font,
        size: 0.5,
        height: 0.01,
      });

      let textMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      let text = new THREE.Mesh(textGeo, textMaterial);
      props.basicComponents.scene.add(text);
      text.position.set(vertex.x, vertex.y, vertex.z);
      text.quaternion.copy(props.basicComponents.camera.quaternion);

      let point = {
        text: text,
        position: vertex,
        trueText: item.text,
      };
      listOfObjects.push(point);
    }
    let holder =
      props.basicComponents.points == null ? [] : props.basicComponents.points;
    props.reduxSetPoint([...listOfObjects, ...holder]);
    updatePoints();
  };

  const onContextCreate = ({ gl, width, height, scale }) => {
    if (props.basicComponents.scene) props.basicComponents.scene.dispose();

    props.reduxSetPoint([]);
    props.reduxSetLine([]);
    props.reduxSetShape([]);
    props.reduxSetDisableCamera(false);
    props.reduxSetControls(null);

    let renderer = new ExpoTHREE.Renderer({ gl });
    renderer.setPixelRatio(scale);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1.0);
    //console.log(renderer.domElement)

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);

    //grid size = 2pixel
    let geometry = null;
    switch (props.initShape) {
      case "cube": {
        geometry = new THREE.BoxBufferGeometry(5, 5, 5);
        //numVertices = 8
        break;
      }
      case "cone": {
        geometry = new THREE.ConeBufferGeometry(5, 10, 32);
        //numVertices = 1
        break;
      }
      case "sphere": {
        geometry = new THREE.SphereBufferGeometry(5, 20, 20);
        //numVertices = 1
        break;
      }
      case "octahedron": {
        geometry = new THREE.OctahedronBufferGeometry(5, 0);
        //numVertices = 6
        break;
      }
      case "prism": {
        geometry = new THREE.CylinderBufferGeometry(5, 5, 10, 3);
        break;
      }
      default: {
        if (props.savedState) {
          loadSavedState(props, scene, updatePoints);
        }
        break;
      }
    }

    const material = new THREE.MeshBasicMaterial({
      color: 0xe7ff37,
      opacity: 0.5,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const axisHelper = new THREE.AxesHelper(200);
    const cameraHandler = new UniCameraHandler(camera);
    const plane = new THREE.GridHelper(200, 200, "#ff3700");

    scene.add(plane, axisHelper);
    props.reduxSetBasicComponents({
      camera: camera,
      cameraHandler: cameraHandler,
      scene: scene,
      renderer: renderer,
    });
    
    if (geometry) {
      let mesh = new THREE.Mesh(geometry, material);
      let edges = new THREE.EdgesGeometry(geometry);
      let line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0xffffff })
      );
      //let wrapper = new THREE.Object3D();
      //wrapper.add(mesh, line);
      scene.add(mesh, line);

      props.reduxSetShape([
        {
          object: mesh,
          edges: line,
          color: "#e7ff37",
          name: "default",
          id: 0,
        },
      ]);
      props.getShapesCallback(props.basicComponents.shapes);
      loadFont(getVerticesWithText(mesh, props.initShape));
    }
  };

  const onRender = (delta) => {
    props.basicComponents.cameraHandler.render(props.basicComponents.points);
    props.basicComponents.renderer.render(
      props.basicComponents.scene,
      props.basicComponents.camera
    );
  };

  useEffect(() => {
    if (props.pointsEdit && props.pointsEdit.length > 0) {
      switch (props.action) {
        case "add_points": {
          addPoints(loadFont, props.pointsEdit);
          break;
        }
        case "remove_points": {
          removePoints(props, updatePoints, props.pointsEdit);
          break;
        }
        default: {
          break;
        }
      }
    }
  }, [props.signalEditPoints]);
  useEffect(() => {
    if (props.pointsConnect && props.pointsConnect.length > 0) {
      switch (props.action) {
        case "connect_points": {
          connectPoints(props, loadFont, props.pointsConnect);
          break;
        }
        case "disconnect_points": {
          disconnectPoints(props, props.pointsConnect);
          break;
        }
        default: {
          break;
        }
      }
    }
  }, [props.signalPoints]);

  useEffect(() => {
    if (props.shapesConnect && props.shapesConnect.length > 0) {
      switch (props.action) {
        case "add_shapes": {
          addShapes(props, props.shapesConnect);
          break;
        }
        case "remove_shapes": {
          removeShapes(props, props.shapesConnect);
          break;
        }
        default: {
          break;
        }
      }
    }
  }, [props.signalShapes]);

  return (
    <>
      <View
        {...panResponder.panHandlers}
        style={{
          flex: 1,
          overflow: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        <ExpoGraphics.View
          style={{ flex: 1 }}
          onContextCreate={(props) => {
            onContextCreate(props);
          }}
          onRender={(_props) => onRender(_props)}
          arEnabled={false}
          onShouldReloadContext={() => true}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "black",
          top: 32,
          right: 90,
          position: "absolute",
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 5,
          borderColor: "red",
          borderWidth: 2,
        }}
        onPress={() => {
          props.reduxSetDisableCamera(!props.miscData.disableCamera);
          setIsLock(() => !isLock);
        }}
      >
        <Text
          style={{
            color: "red",
          }}
        >
          {isLock ? "Unlock" : "Lock"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "black",
          top: 32,
          right: 20,
          position: "absolute",
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 5,
          borderColor: "white",
          borderWidth: 2,
        }}
        onPress={() => {
          const currentItem = {
            shapes: props.basicComponents.shapes,
            lines: props.basicComponents.lines,
            points: props.basicComponents.points,
            name: formatDateTime(new Date()),
            fileName: Date.now(),
            isSynced: false,
            url: "",
          };
          props.reduxAddSaveItem(currentItem);
          Toast.show({
            type: "success",
            position: "top",
            text1: "Current state saved",
            text2: "Success",
            visibilityTime: 3000,
            autoHide: true,
          });
        }}
      >
        <Text
          style={{
            color: "white",
          }}
        >
          Save
        </Text>
      </TouchableOpacity>
    </>
  );
}
