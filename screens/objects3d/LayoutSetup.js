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
  createTextGeoFromPosition,
  drawEdgesFromGeo,
} from "../../components/helper/ShapeHelper";
import { ConvexBufferGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import Toast from "react-native-toast-message";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import DragControls from '../../components/helper/DragControls';

const LONG_PRESS_MIN_DURATION = 800;
const mapDispatchToProps = (dispatch) => {
  return {
    reduxSetBasicComponents: (components) => {
      dispatch(actions.setCamera(components.camera));
      dispatch(actions.setCameraHandler(components.cameraHandler));
      dispatch(actions.setRenderer(components.renderer));
      dispatch(actions.setScene(components.scene));
      dispatch(actions.setIntersects(components.intersects));
      dispatch(actions.setRaycaster(components.raycaster));
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
    }
  };
};
const mapStateToProps = (state) => {
  return {
    basicComponents: state.basicComponents,
    saveComponents: state.saveComponents,
    miscData: state.miscData,
  };
};
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const { height, width } = Dimensions.get("window");

export default connect(mapStateToProps, mapDispatchToProps)(LayoutSetup);
function LayoutSetup(props) {
  const raw_font = require("../../assets/fonts/bebas_neue.typeface.json");
  const font = new THREE.Font(raw_font);
  const [pan, setPan] = useState(new Animated.ValueXY());
  const [mouse, setMouse] = useState(new THREE.Vector2(-10, -10));
  const [val, setVal] = useState({ x: 0, y: 0 });
  const [longPressTimeout, setLongPressTimeout] = useState(null);
  //const [disableCamera, setDisableCamera] = useState(false);
  const [prevX, setPrevX] = useState(null);
  const [prevY, setPrevY] = useState(null);
  //const [controls, setControls] = useState(null);
  const _transformEvent = (event) => {
    event.preventDefault = event.preventDefault || (() => {});
    event.stopPropagation = event.stopPropagation || (() => {});
    return event;
  };

  const formatDateTime = (dateObject) => {
    const year = dateObject.getFullYear();
    const date = dateObject.getDate();
    const monthIndex = dateObject.getMonth();
    const monthName = months[monthIndex];
    const dayIndex = dateObject.getDay();
    const dayName = days[dayIndex];
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();
    return `${hours}:${
      minutes < 10 ? "0" + minutes.toString() : minutes.toString()
    }:${seconds}, ${dayName}, ${date} ${monthName} ${year}`;
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
      props.basicComponents.controls.onDocumentTouchStart(mouse);
    }
    if (!disableCamera)
      props.basicComponents.cameraHandler.handlePanResponderGrant(
        event.nativeEvent
      );
  };
  const distance = (x, y, x1, y1) => {
    return Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
  };
  // Every time the touch/mouse moves
  const handlePanResponderMove = (e, gestureState) => {
    // Keep track of how far we've moved in total (dx and dy)
    const event = _transformEvent({ ...e, gestureState });
    const disableCamera = props.miscData.disableCamera;
    if (disableCamera) {
      mouse.x = (event.nativeEvent.pageX / width) * 2 - 1;
      mouse.y = -(event.nativeEvent.pageY / height) * 2 + 1;
      props.basicComponents.controls.onDocumentMouseMove(mouse);
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
      props.basicComponents.controls.onDocumentMouseCancel();
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

  const over = () => {};
  const out = () => {};

  const onContextCreate = ({ gl, width, height, scale }) => {
    if (props.basicComponents.scene) props.basicComponents.scene.dispose();
    props.reduxSetPoint([]);
    props.reduxSetLine([]);
    props.reduxSetShape([]);
    props.reduxSetDisableCamera(false);

    let renderer = new ExpoTHREE.Renderer({ gl });
    renderer.setPixelRatio(scale);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1.0);
    //console.log(renderer.domElement)

    const raycaster = new THREE.Raycaster();
    let intersects = null;

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);

    //grid size = 2pixI
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
          const data = props.savedState;
          data.lines = JSON.parse(data.lines);
          data.shapes = JSON.parse(data.shapes);
          data.points = JSON.parse(data.points);
          const loader = new THREE.ObjectLoader();
          for (let line of data.lines) {
            scene.add(loader.parse(line.line));
          }
          let points = [];
          for (let point of data.points) {
            const vertex = point.position;
            const text = createTextGeoFromPosition(vertex, point.trueText);
            points.push({
              text: text,
              position: vertex,
              trueText: point.trueText,
            });
            scene.add(text);
          }
          props.reduxSetPoint([...points]);
          updatePoints();
          let shapesHolder = [];
          for (let shape of data.shapes) {
            const object = loader.parse(shape.object);
            const edges = drawEdgesFromGeo(
              object.geometry,
              shape.rotation,
              shape.position
            );
            scene.add(object, edges);
            shapesHolder.push({
              object: object,
              color: shape.color,
              edges: edges,
              name: shape.name,
              id: shape.id,
              rotation: shape.rotation,
              position: shape.position,
            });
          }
          props.reduxSetShape(shapesHolder);
          props.getShapesCallback(props.basicComponents.shapes);
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
      raycaster: raycaster,
      intersects: intersects
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
          color: "#e7ff37",
          edges: line,
          name: "default",
          id: 0,
        },
      ]);
      //var controls = new DragControls(mesh, camera, renderer.domElement);
      props.reduxSetControls(new DragControls([mesh,line], camera));
      props.getShapesCallback(props.basicComponents.shapes);
      loadFont(getVerticesWithText(mesh, props.initShape));
    }

  };

  let INTERSECTED = null;
  
  const onRender = (delta) => {
    props.basicComponents.cameraHandler.render(props.basicComponents.points);
  
    const disableCamera = props.miscData.disableCamera;
    if (disableCamera) {
      props.basicComponents.raycaster.setFromCamera(
        mouse,
        props.basicComponents.camera
      );
      props.basicComponents.intersects = props.basicComponents.raycaster.intersectObjects(
        props.basicComponents.shapes.map((item) => item.object),
        false
      );
      const intersects = props.basicComponents.intersects;
      if (intersects.length > 0) {
          // if the closest object intersected is not the currently stored intersection object
        if (intersects[0].object !== INTERSECTED) {
          // restore previous intersection object (if it exists) to its original color
          if (INTERSECTED)
            INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
          // store reference to closest object as current intersection object
          INTERSECTED = intersects[0].object;
          // store color of closest object (for later restoration)
          INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
          // set a new color for closest object
          INTERSECTED.material.color.setHex(0xffffff);
        }
      } // there are no intersections
      else {
        // restore previous intersection object (if it exists) to its original color
        if (INTERSECTED)
          INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        // remove previous intersection object reference
        //     by setting current intersection object to "nothing"
        INTERSECTED = null;
      }
    } else {
      if (INTERSECTED)
            INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
    }
    props.basicComponents.renderer.render(
      props.basicComponents.scene,
      props.basicComponents.camera
    );
  };

  const addBasicShapes = (
    type,
    position,
    sizes,
    rotation = null,
    color = null,
    points = null,
    name
  ) => {
    let geometry = null;
    let material = null;
    switch (type) {
      case "box": {
        geometry = new THREE.BoxBufferGeometry(
          sizes.width,
          sizes.height,
          sizes.depth
        );
        material = new THREE.MeshBasicMaterial({
          color: color ? new THREE.Color(color) : 0xe7ff37,
          opacity: 0.5,
          transparent: true,
          side: THREE.DoubleSide,
        });
        break;
      }
      case "custom": {
        geometry = new ConvexBufferGeometry(points);
        material = new THREE.MeshBasicMaterial({
          color: color ? new THREE.Color(color) : 0xe7ff37,
          opacity: 0.5,
          transparent: true,
          side: THREE.DoubleSide,
        });
        break;
      }
      case "sphere": {
        geometry = new THREE.SphereBufferGeometry(
          sizes.radius,
          sizes.radius * 5,
          sizes.radius * 5
        );
        material = new THREE.MeshBasicMaterial({
          color: color ? new THREE.Color(color) : 0xe7ff37,
          opacity: 0.5,
          transparent: true,
        });
        break;
      }
      case "cone": {
        geometry = new THREE.ConeBufferGeometry(
          sizes.radius,
          sizes.height,
          sizes.radius * 7
        );
        material = new THREE.MeshBasicMaterial({
          color: color ? new THREE.Color(color) : 0xe7ff37,
          opacity: 0.5,
          transparent: true,
        });
        break;
      }
      default: {
        break;
      }
    }

    let mesh = new THREE.Mesh(geometry, material);
    let edges = new THREE.EdgesGeometry(geometry);
    let line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    if (position) {
      mesh.position.set(position.x, position.y, position.z);
      line.position.set(position.x, position.y, position.z);
    }
    if (rotation) {
      mesh.rotation.set(rotation.x, rotation.y, rotation.z);
      line.rotation.set(rotation.x, rotation.y, rotation.z);
    }
    props.basicComponents.scene.add(mesh, line);
    props.reduxAddShape({
      object: mesh,
      edges: line,
      color: color,
      name: name,
      id: props.basicComponents.shapes.length,
      rotation: rotation,
      position: position,
    });
    props.getShapesCallback(props.basicComponents.shapes);
  };

  const connectPoints = (points) => {
    const newPoints = [];
    const actualPoints = points.map((item) => {
      if (item.isNew) {
        newPoints.push(item.item);
      }
      return item.item.point;
    });
    let lineName = "";
    for (let index = 0; index < points.length; index++) {
      let item = points[index];
      lineName += item.item.text;
      if (index !== points.length - 1) lineName += "-";
    }
    loadFont(newPoints);
    let geometry = new THREE.BufferGeometry().setFromPoints(actualPoints);
    let material = new THREE.LineBasicMaterial({ color: 0xffffff });
    let newLine = new THREE.Line(geometry, material);
    props.basicComponents.scene.add(newLine);
    props.reduxAddLine({ line: newLine, text: lineName });
    props.getLinesCallback(props.basicComponents.lines);
  };

  const disconnectPoints = (lines) => {
    for (let line of lines) {
      let realLine = line.item.line;
      props.basicComponents.scene.remove(realLine);
      props.reduxRemoveLine(line.item);
      props.getLinesCallback(props.basicComponents.lines);
    }
  };

  const addShapes = (shapes) => {
    for (let shape of shapes) {
      if (shape.item.type) {
        addBasicShapes(
          shape.item.type,
          shape.item.position,
          shape.item.sizes,
          shape.item.rotation,
          shape.item.color,
          shape.item.points,
          shape.item.name
        );
      }
    }
  };

  const removeShapes = (shapes) => {
    for (let shape of shapes) {
      props.basicComponents.scene.remove(shape.object, shape.edges);
      props.reduxRemoveShape(shape);
    }
    props.getShapesCallback(props.basicComponents.shapes);
  };
  const addPoints = (points) => {
    let holder = [];
    for (let point of points) {
      holder.push(point.item);
    }
    loadFont(holder);
  };
  const removePoints = (points) => {
    for (let point of points) {
      props.basicComponents.scene.remove(point.item.item.text);
      props.reduxSetPoint(
        props.basicComponents.points.filter((item) => item !== point.item.item)
      );
    }
    updatePoints();
  };
  useEffect(() => {
    if (props.pointsEdit && props.pointsEdit.length > 0) {
      switch (props.action) {
        case "add_points": {
          addPoints(props.pointsEdit);
          break;
        }
        case "remove_points": {
          removePoints(props.pointsEdit);
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
          connectPoints(props.pointsConnect);
          break;
        }
        case "disconnect_points": {
          disconnectPoints(props.pointsConnect);
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
          addShapes(props.shapesConnect);
          break;
        }
        case "remove_shapes": {
          removeShapes(props.shapesConnect);
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
      <LongPressGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            Vibration.vibrate();
            props.reduxSetDisableCamera(!props.miscData.disableCamera);
            //Alert.alert("I'm being pressed for so long");
          }
        }}
        minDurationMs={800}
      >
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
      </LongPressGestureHandler>
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
