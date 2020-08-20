import React, { useState, useEffect } from "react";
import { View, PanResponder, Text, TouchableOpacity } from "react-native";
import UniCameraHandler from "./UniCameraHandler";
import ExpoTHREE from "expo-three";
global.Image = undefined;
import ExpoGraphics from "expo-graphics";
import * as THREE from "three";
import { connect } from "react-redux";
import actions from "../../actions";
import {
  getVerticesWithText,
  createTetraHedron, createTextGeoFromPosition, drawEdgesFromGeo,
} from "../../components/helper/ShapeHelper";
import { ConvexBufferGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import Toast from "react-native-toast-message";
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
  };
};
const mapStateToProps = (state) => {
  return {
    basicComponents: state.basicComponents,
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
export default connect(mapStateToProps, mapDispatchToProps)(LayoutSetup);

function LayoutSetup(props) {
  //var listOfObjects = []
  const raw_font = require("../../assets/fonts/bebas_neue.typeface.json");
  const font = new THREE.Font(raw_font);

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
    return `${hours}:${minutes < 10 ? '0' + minutes.toString() : minutes.toString()}:${seconds}, ${dayName}, ${date} ${monthName} ${year}`;
    //console.log(formatted); 
  };
  //Should we become active when the user presses down on the square?
  const handleStartShouldSetPanResponder = () => {
    return true;
  };

  // We were granted responder status! Let's update the UI
  const handlePanResponderGrant = (e, gestureState) => {
    const event = _transformEvent({ ...e, gestureState });
    //		  console.log(event
    props.basicComponents.cameraHandler.handlePanResponderGrant(
      event.nativeEvent
    );
  };

  // Every time the touch/mouse moves
  const handlePanResponderMove = (e, gestureState) => {
    // Keep track of how far we've moved in total (dx and dy)
    const event = _transformEvent({ ...e, gestureState });
    //  console.log(event)
    props.basicComponents.cameraHandler.handlePanResponderMove(
      event.nativeEvent,
      gestureState
    );
  };

  // When the touch/mouse is lifted
  const handlePanResponderEnd = (e, gestureState) => {
    const event = _transformEvent({ ...e, gestureState });
    //		  console.log(event)
    //if(cameraHandler != null)

    props.basicComponents.cameraHandler.handlePanResponderEnd(
      event.nativeEvent
    );
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: handleStartShouldSetPanResponder,
    onPanResponderGrant: handlePanResponderGrant,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderEnd,
    onPanResponderTerminate: handlePanResponderEnd,
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
    var listOfObjects = [];
    for (let item of listOfVertices) {
      const vertice = item.point;
      const textGeo = new THREE.TextGeometry(item.text, {
        font: font,
        size: 0.5,
        height: 0.01,
      });
      var textMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      //var edges = new THREE.EdgesGeometry(textGeo);
      //var line = new THREE.LineSegments(
      //  edges,
      //  new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 })
      //);
      var text = new THREE.Mesh(textGeo, textMaterial);
      props.basicComponents.scene.add(text);
      text.position.set(vertice.x, vertice.y, vertice.z);
      //line.position.set(vertice.x, vertice.y, vertice.z);

      text.quaternion.copy(props.basicComponents.camera.quaternion);
      //line.quaternion.copy(props.basicComponents.camera.quaternion);

      var point = {
        text: text,
        position: vertice,
        trueText: item.text,
      };
      listOfObjects.push(point);
    }
    var holder =
      props.basicComponents.points == null ? [] : props.basicComponents.points;
    //console.log("change in setup");
    props.reduxSetPoint([...listOfObjects, ...holder]);
    //console.log(props.basicComponents.points.length);
    updatePoints();
  };

  const onContextCreate = ({ gl, width, height, scale }) => {
    //console.log(width, height);
    if (props.basicComponents.scene) props.basicComponents.scene.dispose();
    props.reduxSetPoint([]);
    props.reduxSetLine([]);
    props.reduxSetShape([]);

    var renderer = new ExpoTHREE.Renderer({ gl });
    renderer.setPixelRatio(scale);
    renderer.setSize(width, height);

    renderer.setClearColor(0x000000, 1.0);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);

    //grid size = 2pixI
    var geometry = null;
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
         /* try {
            for (let shape of props.savedState.shapes) {
              scene.add(shape.object, shape.edges);
            }
            for (let point of props.savedState.points) {
              scene.add(point.text);
            }
            for (let line of props.savedState.lines) {
              scene.add(line.line);
            }
            if (props.savedState.points && props.savedState.points.length > 0) {
              props.reduxSetPoint([...props.savedState.points]);
              updatePoints();
            }
          } catch (e) {*/
            const data = props.savedState;
            data.lines = JSON.parse(data.lines);
            data.shapes = JSON.parse(data.shapes);
            data.points = JSON.parse(data.points);
            const loader = new THREE.ObjectLoader();
                    for(let line of data.lines) {
                      scene.add(loader.parse(line.line));
                    }
                    let points = [];
                    for(let point of data.points) {
                      const vertex = point.position;
                      const text = createTextGeoFromPosition(vertex, point.trueText);
                      points.push({text: text, position: vertex, trueText: point.trueText});
                      scene.add(text);
                    }
                    props.reduxSetPoint([...points]);
                    updatePoints();
                    for(let shape of data.shapes) {
                      const object = loader.parse(shape.object);
                      const edges = drawEdgesFromGeo(object.geometry);
                      scene.add(object, edges);
                    }
          }
      //  }
        break;
      }
    };
    //new THREE.SphereBufferGeometry(100, 36, 36);
    //geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

    const material = new THREE.MeshBasicMaterial({
      color: 0xe7ff37,
      opacity: 0.5,
      transparent: true,
      side: THREE.DoubleSide,
    });
    //var newMesh = new THREE.Mesh(geometry, material);
    const axisHelper = new THREE.AxesHelper(200);
    //mesh.add(axisHelper)
    const cameraHandler = new UniCameraHandler(camera); //new CameraHandler(container, camera, mesh, line, axisHelper);
    const plane = new THREE.GridHelper(200, 200, "#ff3700");

    scene.add(plane, axisHelper);
    //createTetraHedron(scene);
    //newMesh.position.set(2.5, 2.5, 2.5);
    props.reduxSetBasicComponents({
      camera: camera,
      cameraHandler: cameraHandler,
      scene: scene,
      renderer: renderer,
    });
    if (geometry) {
      var mesh = new THREE.Mesh(geometry, material);
      var edges = new THREE.EdgesGeometry(geometry);
      var line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0xffffff })
      );
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

  const addBasicShapes = (
    type,
    position,
    sizes,
    rotation = null,
    color = null,
    points = null,
    name
  ) => {
    var geometry = null;
    var material = null;
    //console.log(color)
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
          //side: THREE.DoubleSide,
        });
        break;
      }
      default: {
        break;
      }
    }
    //geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    var mesh = new THREE.Mesh(geometry, material);
    //mesh.position.set(position.x, position.y, position.z);
    //var newMesh = new THREE.Mesh(geometry, material);
    var edges = new THREE.EdgesGeometry(geometry);
    var line = new THREE.LineSegments(
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
    var lineName = "";
    for (let index = 0; index < points.length; index++) {
      var item = points[index];
      lineName += item.item.text;
      if (index != points.length - 1) lineName += "-";
    }
    loadFont(newPoints);
    var geometry = new THREE.BufferGeometry().setFromPoints(actualPoints);
    var material = new THREE.LineBasicMaterial({ color: 0xffffff });
    var newLine = new THREE.Line(geometry, material);
    props.basicComponents.scene.add(newLine);
    props.reduxAddLine({ line: newLine, text: lineName });
    props.getLinesCallback(props.basicComponents.lines);
  };

  const disconnectPoints = (lines) => {
    for (let line of lines) {
      var realLine = line.item.line;
      props.basicComponents.scene.remove(realLine);
      props.reduxRemoveLine(line.item);
      props.getLinesCallback(props.basicComponents.lines);
    }
  };

  const addShapes = (shapes) => {
    for (let shape of shapes) {
      if (shape.item.type) {
        //console.log(shape.item)
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
    var holder = [];
    for (let point of points) {
      holder.push(point.item);
      //props.basicComponents.scene.add(point.item.item.text);
    }
    loadFont(holder);
    //props.reduxSetPoint([...props.basicComponents.points, ...holder]);
    //updatePoints();
    //props.getPointsCallback(props.basicComponents.points);
  };
  const removePoints = (points) => {
    for (let point of points) {
      props.basicComponents.scene.remove(point.item.item.text);
      props.reduxSetPoint(
        props.basicComponents.points.filter((item) => item !== point.item.item)
      );
    }
    updatePoints();
    //props.getPointsCallback(props.basicComponents.points);
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
          right: 20,
          position: "absolute",
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 5,
          borderColor: "white",
          borderWidth: 2,
        }}
        onPress={() => {
          props.reduxAddSaveItem({
            shapes: props.basicComponents.shapes,
            lines: props.basicComponents.lines,
            points: props.basicComponents.points,
            name: formatDateTime(new Date()),
            fileName: Date.now(),
            isSynced: false
          });
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
