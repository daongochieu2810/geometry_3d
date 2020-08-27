//import Expo from "expo";
import { GLView } from "expo-gl";
import ExpoTHREE, { THREE } from "expo-three"; // 3.0.0-alpha.4
import React from "react";
//import { connect } from "react-redux";
import {
    View,
    Animated,
    Text,
    Dimensions,
    PanResponder,
} from "react-native";

const { height, width } = Dimensions.get("window");

class HomeScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pan: new Animated.ValueXY(),
            mouse: new THREE.Vector2(-10, -10), // -10 is to force the start position to be OFF the screen so the user isn't automatically ontop of something
        };
        // Turn off extra warnings
        THREE.suppressExpoWarnings(true);
        // hide warnings yellow box in ios
        console.disableYellowBox = true;
    }

    componentWillMount() {
        this._val = { x: 0, y: 0 };
        this.state.pan.addListener((value) => (this._val = value));

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => true,
            onPanResponderGrant: (e, gesture) => {
                this.state.pan.setOffset({
                    x: this._val.x,
                    y: this._val.y,
                });
                this.state.pan.setValue({ x: -10, y: -10 });
            },
            onPanResponderMove: ({ nativeEvent }, gestureState) => {
                if (this.state.gl) {
                    // ratio of mouse position to the width of the screen
                    this.state.mouse.x =
                        (nativeEvent.locationX / width) * 2 - 1;
                    this.state.mouse.y =
                        -(nativeEvent.locationY / height) * 2 + 1;
                }
            },
            onPanResponderRelease: ({ nativeEvent }, gestureState) => {
                this.state.mouse.x = -10;
                this.state.mouse.y = -10;
            },
        });
    }

    _onGLContextCreate = async (gl) => {
        const renderer = new ExpoTHREE.Renderer({ gl, depth: false });
        renderer.setPixelRatio(window.pixelRatio || 1);
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0x000000, 1.0);
        const camera = new THREE.PerspectiveCamera(
            100,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            20000,
        );
        camera.position.set(0, 0, 1.0).multiplyScalar(20);
        const raycaster = new THREE.Raycaster();
        const scene = new THREE.Scene();

        const yourMesh = // Your mesh
            scene.add(yourMesh);


        let intersects;

        const over = () => {
        };
        const out = () => {
        };

        const animate = (p) => {
            requestAnimationFrame(animate);

            camera.updateMatrixWorld();

            raycaster.setFromCamera(this.state.mouse, camera);
            intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                // OVER
                over()
            } else {
                // NOT OVER
                out()
            }

            renderer.render(scene, camera);

            gl.endFrameEXP();
        };

        animate();
    };

    render() {
        const { height, width } = Dimensions.get("window");
        return (
            <View
                {...this.panResponder.panHandlers}
                style={[
                    {
                        width,
                        height,
                    },
                ]}>
                <GLView
                    style={{ flex: 1 }}
                    onContextCreate={this._onGLContextCreate}
                />
            </View>
        );
    }

}

export default Screen