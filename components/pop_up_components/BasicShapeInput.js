import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
  Dimensions,
} from "react-native";
import { SliderHuePicker } from "react-native-slider-color-picker";
import tinycolor from "tinycolor2";
const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

export default function BasicShapeInput({
  inputCallback,
  type,
  mainScrollView,
}) {
  const [newShapes, setNewShapes] = useState(() => []);
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const [z, setZ] = useState(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);
  const [r, setR] = useState(null);
  const [color, setColor] = useState(0xe7ff37);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [depth, setDepth] = useState(0);
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);

  const validate = () => {
    if (!name) return false;
    if (type !== "custom") {
      if (isNaN(x) || isNaN(y) || isNaN(z) || !x || !y || !z) {
        return false;
      }
    }
    if (type !== "sphere" && (isNaN(rotX) || isNaN(rotY) || isNaN(rotZ))) {
      return false;
    }
    if (type === "box" && (isNaN(width) || isNaN(height) || isNaN(depth))) {
      return false;
    }
    if (type === "sphere" && (isNaN(r) || !r)) {
      return false;
    }
    if (type === "cone" && (isNaN(r))) {
      return false;
    }
    return true;
  };
  const resetInput = () => {
    setNewShapes(() => []);
    setX(null);
    setY(null);
    setZ(null);
    setRotX(0);
    setRotY(0);
    setRotZ(0);
    setR(null);
    setWidth(0);
    setHeight(0);
    setDepth(0);
    setName(null);
    setError(null);
  };
  const changeColor = (colorHsvOrRgb, resType) => {
    if (resType === "end") {
      colorHsvOrRgb.s = 1;
      colorHsvOrRgb.v = 1;
      //console.log(colorHsvOrRgb)
      setColor(() => tinycolor(colorHsvOrRgb).toHexString());
    }
  };

  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ marginTop: 5, marginRight: 10 }}>Shape name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            setName(() => text);
          }}
          value={name}
        />
      </View>
      {type != "custom" && (
        <View
          style={{
            flexDirection: "row",
            marginLeft: 5,
          }}
        >
          <Text style={{ marginRight: 5, fontSize: 20 }}>x:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setX(() => text);
            }}
            value={x}
          />
          <Text style={{ marginRight: 5, fontSize: 20 }}>y:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setY(() => text);
            }}
            value={y}
          />
          <Text style={{ marginRight: 5, fontSize: 20 }}>z:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setZ(() => text);
            }}
            value={z}
          />
        </View>
      )}
      {type === "cone" && (<View
          style={{
            flexDirection: "row",
            marginLeft: 5,
            marginTop: 5
          }}
      >
        <Text style={{ marginRight: 5, fontSize: 20 }}>r:</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setR(() => text);
            }}
            value={r}
        />
        <Text style={{ marginRight: 5, fontSize: 20 }}>h:</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setHeight(() => text);
            }}
            value={height}
        />
      </View>)}
      {type === "box" && (
        <View
          style={{
            flexDirection: "row",
            marginLeft: 5,
            marginTop: 5,
          }}
        >
          <Text style={{ marginRight: 5, fontSize: 20 }}>w:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setWidth(() => text);
            }}
            value={width}
          />
          <Text style={{ marginRight: 5, fontSize: 20 }}>h:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setHeight(() => text);
            }}
            value={height}
          />
          <Text style={{ marginRight: 5, fontSize: 20 }}>d:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setDepth(() => text);
            }}
            value={depth}
          />
        </View>
      )}
      {type !== "sphere" && type !== "custom" && (
        <>
          <Text style={{ marginTop: 5 }}>Rotations</Text>
          <View
            style={{
              flexDirection: "row",
              marginLeft: 5,
            }}
          >
            <Text style={{ marginRight: 5, fontSize: 20 }}>x:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setRotX(() => text);
              }}
              value={rotX}
            />
            <Text style={{ marginRight: 5, fontSize: 20 }}>y:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setRotY(() => text);
              }}
              value={rotY}
            />
            <Text style={{ marginRight: 5, fontSize: 20 }}>z:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setRotZ(() => text);
              }}
              value={rotZ}
            />
          </View>
        </>
      )}
      {type === "sphere" && (
        <View
          style={{
            flexDirection: "row",
            marginLeft: 5,
          }}
        >
          <Text style={{ marginRight: 5, fontSize: 20 }}>r:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              setR(() => text);
            }}
            value={r}
          />
        </View>
      )}
      {error && <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>}
      <Text
        style={{
          marginTop: 10,
          marginRight: 15,
        }}
      >
        Choose color (slide)
      </Text>
      <View
        style={{
          marginTop: 10,
          height: 12,
          marginRight: 15,
          alignItems: "center",
        }}
      >
        <SliderHuePicker
          trackStyle={[{ height: 12, width: SCREEN_WIDTH * 0.6 }]}
          thumbStyle={styles.thumb}
          oldColor={color}
          onColorChange={changeColor}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            marginTop: 10,
            borderWidth: 1,
            borderColor: "#fc7b03",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            marginRight: 10,
          }}
          onPress={() => {
            if (!validate()) {
              setError("Wrongly formatted input");
              return;
            }
            var newShape = null;
            if (type === "box") {
              newShape = {
                item: {
                  position: { x: x, y: y, z: z },
                  sizes: { width: width, height: height, depth: depth },
                  rotation: {
                    x: (rotX / 180) * Math.PI,
                    y: (rotY / 180) * Math.PI,
                    z: (rotZ / 180) * Math.PI,
                  },
                  color: color,
                  name: name,
                  type: "box",
                },
                id: newShapes.length,
                chosen: false,
              };
            } else if (type === "sphere") {
              newShape = {
                item: {
                  position: { x: x, y: y, z: z },
                  sizes: { radius: r },
                  name: name,
                  color: color,
                  type: "sphere",
                },
                id: newShapes.length,
                chosen: false,
              };
            } else if (type === "custom") {
              newShape = {
                item: {
                  points: [],
                  color: color,
                  name: name,
                  type: "custom",
                },
                id: newShapes.length,
                chosen: false,
              };
            } else if (type === "cone") {
              newShape = {
                item: {
                  position: { x: x, y: y, z: z },
                  sizes: { radius: r, height: height },
                  rotation: {
                    x: (rotX / 180) * Math.PI,
                    y: (rotY / 180) * Math.PI,
                    z: (rotZ / 180) * Math.PI,
                  },
                  color: color,
                  name: name,
                  type: "cone",
                },
                id: newShapes.length,
                chosen: false,
              };
            }
            setNewShapes(() => [...newShapes, newShape]);
            inputCallback(newShape);

          }}
        >
          <Text>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginTop: 10,
            borderWidth: 1,
            borderColor: "#03fcb6",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            marginRight: 10,
          }}
          onPress={() => {
            //if (isMounted) {
            resetInput();
            inputCallback(null);
            //}
          }}
        >
          <Text>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginTop: 10,
            borderWidth: 1,
            borderColor: "#7017ff",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
          }}
          onPress={() => {
            //if (isMounted) {
            resetInput();
            inputCallback(null);
            mainScrollView.scrollTo({ x: 0, y: 0, animated: true });
            //}
          }}
        >
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  input: {
    marginRight: 10,
    width: SCREEN_WIDTH * 0.15,
    borderBottomColor: "#8a8a8a",
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 15,
  },
  thumb: {
    width: 20,
    height: 20,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.35,
  },
});
