import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ExpoTHREE from "expo-three";
import ExpoGraphics from "expo-graphics";
import * as THREE from "three";

export default function SingleShapeView({ shape }) {
  const [cameraHandler, setCameraHandler] = useState(null);
  const _transformEvent = (event) => {
    event.preventDefault = event.preventDefault || (() => {});
    event.stopPropagation = event.stopPropagation || (() => {});
    return event;
  };

  const handleStartShouldSetPanResponder = () => {
    return true;
  };

  // We were granted responder status! Let's update the UI
  const handlePanResponderGrant = (e, gestureState) => {
    const event = _transformEvent({ ...e, gestureState });
    cameraHandler.handlePanResponderGrant(event.nativeEvent);
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
  const onContextCreate = ({ gl }) => {
    let renderer = new ExpoTHREE.Renderer({ gl });
    renderer.setPixelRatio(scale);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1.0);
    //console.log(renderer.domElement)

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);
    const cameraHandler = new UniCameraHandler(camera);
  };

  const onRender = () => {
    cameraHandler.render(points);
    renderer.render(scene, camera);
  };

  return (
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
  );
}
