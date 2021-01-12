import React, { useState, useEffect } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import ExpoTHREE from "expo-three";
import ExpoGraphics from "expo-graphics";
import * as THREE from "three";
import UniCameraHandler from "./UniCameraHandler";
import { connect } from "react-redux";
import actions from "../../actions";
const mapDispatchToProps = (dispatch) => {
  return {
    reduxSetSingleShapeComponents: (components) => {
      dispatch(actions.setSingleCamera(components.camera));
      dispatch(actions.setSingleCameraHandler(components.cameraHandler));
      dispatch(actions.setSingleRenderer(components.renderer));
      dispatch(actions.setSingleScene(components.scene));
    },
  };
};
const mapStateToProps = (state) => {
  return {
    singleShapeComponents: state.singleShapeComponents,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SingleShapeView);
function SingleShapeView(props) {
  const { shape, edges, points, newText, oldText, newTextGeo } = props;
  /*const [cameraHandler, setCameraHandler] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [camera, setCamera] = useState(null);
  const [scene, setScene] = useState(null);*/
  let clonePoints = points
    ? points.map((item) => {
        return {
          ...item,
          text: item.text.clone(),
        };
      })
    : [];
  useEffect(() => {
    //console.log(oldText);
    const shapePosition = shape.position;
    if (newText !== "" && oldText !== "" && newTextGeo) {
      const { scene, cameraHandler } = props.singleShapeComponents;
      for (let point of clonePoints) {
        //console.log(point.trueText);
        if (point.trueText === newText) {
          //console.log("found");
          const oldTexGeo = scene.getObjectByName(oldText);
          scene.remove(oldTexGeo);
          point.text = newTextGeo.clone();
          scene.add(point.text);
          let { x, y, z } = point.text.position;
          point.text.position.set(
            x - shapePosition.x,
            y - shapePosition.y,
            z - shapePosition.z
          );
          cameraHandler.addObjectsToTrack([point.text]);
          break;
        }
      }
    }
  }, [newText, newTextGeo, oldText]);

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
    const { cameraHandler } = props.singleShapeComponents;
    if (cameraHandler) cameraHandler.handlePanResponderGrant(event.nativeEvent);
  };

  // Every time the touch/mouse moves
  const handlePanResponderMove = (e, gestureState) => {
    // Keep track of how far we've moved in total (dx and dy)
    const event = _transformEvent({ ...e, gestureState });
    const { cameraHandler } = props.singleShapeComponents;
    cameraHandler.handlePanResponderMove(event.nativeEvent, gestureState);
  };

  // When the touch/mouse is lifted
  const handlePanResponderEnd = (e, gestureState) => {
    const { cameraHandler } = props.singleShapeComponents;
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
    let offset = 4;

    const boundingBox = new THREE.Box3();

    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject(object);

    //const center = boundingBox.getCenter();

    const size = boundingBox.getSize();

    // get the max side of the bounding box (fits to width OR height as needed )
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));

    cameraZ *= offset; // zoom out a little so that objects don't fill the screen

    camera.position.z = cameraZ;

    const minZ = boundingBox.min.z;
    const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

    camera.far = cameraToFarEdge * 3;
    camera.updateProjectionMatrix();
    return cameraZ;
  };

  const onContextCreate = ({ gl, width, height, scale }) => {
    console.log(points.length);
    let _renderer = new ExpoTHREE.Renderer({ gl });
    _renderer.setPixelRatio(scale);
    _renderer.setSize(width, height);
    _renderer.setClearColor(0x000000, 1.0);
    //console.log(renderer.domElement)

    let shapePosition = shape.position;
    const cloneShape = shape.clone();
    const cloneEdges = edges.clone();
    cloneShape.position.set(0, 0, 0);
    cloneEdges.position.set(0, 0, 0);
    let _scene = new THREE.Scene();
    let _camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 10000);
    const baseDistance = 10; //fitCameraToObject(_camera, cloneShape);
    let _cameraHandler = new UniCameraHandler(_camera, baseDistance);
    for (let point of clonePoints) {
      const textGeo = point.text;
      textGeo.name = point.trueText;
      let { x, y, z } = textGeo.position;
      //console.log(cloneShape.position);
      textGeo.position.set(
        x - shapePosition.x,
        y - shapePosition.y,
        z - shapePosition.z
      );
      //console.log(textGeo.position);
      _scene.add(textGeo);
    }
    const axisHelper = new THREE.AxesHelper(200);
    cloneShape.add(axisHelper);
    _scene.add(cloneShape, cloneEdges);
    props.reduxSetSingleShapeComponents({
      cameraHandler: _cameraHandler,
      camera: _camera,
      renderer: _renderer,
      scene: _scene,
    });
  };

  const onRender = () => {
    let {
      cameraHandler,
      renderer,
      camera,
      scene,
    } = props.singleShapeComponents;
    cameraHandler.render(clonePoints);
    renderer.render(scene, camera);
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
        onRender={(_props) => onRender(_props)}
        arEnabled={false}
        onShouldReloadContext={() => true}
      />
    </View>
  );
}
