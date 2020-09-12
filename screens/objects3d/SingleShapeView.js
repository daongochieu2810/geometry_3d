import React, { useState } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import ExpoTHREE from "expo-three";
import ExpoGraphics from "expo-graphics";
import * as THREE from "three";
import UniCameraHandler from "./UniCameraHandler";

export default function SingleShapeView({ shape, edges, points }) {
  /*const [cameraHandler, setCameraHandler] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [camera, setCamera] = useState(null);
  const [scene, setScene] = useState(null);*/
  let cameraHandler = null;
  let renderer = null;
  let camera = null;
  let scene = null;
  const clonePoints = points
    ? points.map((item) => {
        return {
          ...item,
          text: item.text.clone(),
        };
      })
    : [];

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
    if (cameraHandler) cameraHandler.handlePanResponderGrant(event.nativeEvent);
  };

  // Every time the touch/mouse moves
  const handlePanResponderMove = (e, gestureState) => {
    // Keep track of how far we've moved in total (dx and dy)
    const event = _transformEvent({ ...e, gestureState });
    cameraHandler.handlePanResponderMove(event.nativeEvent, gestureState);
  };

  // When the touch/mouse is lifted
  const handlePanResponderEnd = (e, gestureState) => {
    const event = _transformEvent({ ...e, gestureState });
    cameraHandler.handlePanResponderEnd(event.nativeEvent);
  };
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: handleStartShouldSetPanResponder,
    onPanResponderGrant: handlePanResponderGrant,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderEnd,
    onPanResponderTerminate: handlePanResponderEnd,
    onShouldBlockNativeResponder: () => false,
    onPanResponderTerminationRequest: () => true,
  });
  const fitCameraToObject = (camera, object) => {
    let offset = 5;

    const boundingBox = new THREE.Box3();

    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject(object);
    const size = boundingBox.getSize();
    // get the max side of the bounding box (fits to width OR height as needed )
    let maxDim = Math.max(size.x, size.y, size.z);
    //console.log(maxDim);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));

    cameraZ *= offset; // zoom out a little so that objects don't fill the screen
    return cameraZ;
  };

  const onContextCreate = ({ gl, width, height, scale }) => {
    renderer = new ExpoTHREE.Renderer({ gl });
    renderer.setPixelRatio(scale);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1.0);
    //console.log(renderer.domElement)

    const cloneShape = shape.clone();
    const cloneEdges = edges.clone();
    cloneShape.position.set(0, 0, 0);
    cloneEdges.position.set(0, 0, 0);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 10000);
    const baseDistance = fitCameraToObject(camera, cloneShape);
    cameraHandler = new UniCameraHandler(camera, baseDistance);
    scene.add(cloneShape, cloneEdges);
    for (let point of clonePoints) {
      scene.add(point.text);
    }
  };

  const onRender = (_, _cameraHandler, _renderer, _scene, _camera) => {
    _cameraHandler.render(clonePoints);
    _renderer.render(_scene, _camera);
  };

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
      }}
    >
      <ExpoGraphics.View
        // style={{ flex: 1 }}
        onContextCreate={(props) => {
          onContextCreate(props);
        }}
        onRender={(_props) =>
          onRender(_props, cameraHandler, renderer, scene, camera)
        }
        arEnabled={false}
        onShouldReloadContext={() => true}
      />
    </View>
  );
}
