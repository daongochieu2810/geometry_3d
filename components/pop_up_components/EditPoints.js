import React, { useState, useEffect } from "react";
import {View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Dimensions} from "react-native";
import * as THREE from "three";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;
export default function EditPoints({ currentPoints, returnPoints, isAdd }) {
    var _pointInput = currentPoints.map((item, index) => ({
        item: item,
        id: index,
        chosen: false,
        isNew: false,
    }));
    const [pointInput, setPointInput] = useState(_pointInput);
    const [newPoints, setNewPoints] = useState([]);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [z, setZ] = useState(0);
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    useEffect(() => {
        if (newPoints.length > 0) returnPoints(newPoints);
    }, [newPoints]);

    const exist = (newName) => {
        for (let point of pointInput) {
            if (point.item.text === newName) return true;
        }
        return false;
    };
  return (
    <View
      style={{
        marginTop: 10,
        marginLeft: 15,
        marginBottom: 15,
      }}
    >
      <Text style={{
          textAlign: 'center'
      }}>{isAdd ? "Add points" : "Remove points"}</Text>
        {!isAdd && <>
        <Text>Existing points</Text>
        <FlatList
            data={pointInput}
            extraData={pointInput}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => `${item.id} existing points`}
            style={{
                marginRight: 10,
                marginTop: 5
            }}
            renderItem={({item, index}) =>
                (<TouchableOpacity
                    style={{
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        backgroundColor: item.chosen ? "#ff481f" : "#71eb34",
                        borderRadius: 5,
                        margin: 5,
                        alignSelf: "baseline",
                    }}
                    onPress={() => {
                        pointInput[item.id].chosen = !pointInput[item.id].chosen;
                        //if (isMounted) {
                        if (pointInput[item.id].chosen) {
                            setNewPoints(() => [...newPoints, pointInput[item.id]]);
                        } else {
                            setNewPoints(() =>
                                newPoints.filter((point) => point.id != item.id)
                            );
                        }
                        setPointInput(() => [...pointInput]);
                        //}
                    }}>
                    <Text>{item.item.text}</Text>
                </TouchableOpacity>)}/>
                <Text>Points to remove</Text>
            <FlatList
                data={newPoints}
                extraData={newPoints}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item) => `${item.id} points remove`}
                style={{
                    marginRight: 10,
                    marginTop: 5
                }}
                renderItem={({item, index}) =>
                    (<TouchableOpacity
                        style={{
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            backgroundColor: item.chosen ? "#ff481f" : "#71eb34",
                            borderRadius: 5,
                            margin: 5,
                            alignSelf: "baseline",
                        }}>
                        <Text>{item.item.text}</Text>
                    </TouchableOpacity>)}/>
                </>}
        {isAdd && <>
            <Text>Points to add</Text>
            <FlatList
                data={newPoints}
                extraData={newPoints}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item) => `${item.id} points remove`}
                style={{
                    marginRight: 10,
                    marginTop: 5
                }}
                renderItem={({item, index}) =>
                    (<TouchableOpacity
                        style={{
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            backgroundColor: item.chosen ? "#ff481f" : "#71eb34",
                            borderRadius: 5,
                            margin: 5,
                            alignSelf: "baseline",
                        }}>
                        <Text>{item.item.text}</Text>
                    </TouchableOpacity>)}/>
            <View style={{ flexDirection: "row" }}>
                <Text style={{ marginTop: 5, marginRight: 10 }}>Point name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                        setName(() => text);
                    }}
                    value={name}
                />
            </View>
            <View
                style={{
                    flexDirection: "row",
                    marginLeft: 5,
                    marginTop: 5
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
            {error && <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>}
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
                        if (isNaN(x) || isNaN(y) || isNaN(z) || name === "") {
                            setError("Wrongly formatted input");
                            return;
                        }
                        if (exist(name)) {
                            setError("Name exists");
                            return;
                        }
                        setNewPoints(() => [
                            ...newPoints,
                            {
                                item: {
                                    point: new THREE.Vector3(
                                        parseFloat(x),
                                        parseFloat(y),
                                        parseFloat(z)
                                    ),
                                    text: name,
                                    position: new THREE.Vector3( parseFloat(x), parseFloat(y), parseFloat(z))
                                },
                                id: newPoints.length,
                                chosen: false,
                                isNew: true,
                            },
                        ]);
                        setX(0);
                        setY(0);
                        setZ(0);
                        setName("");
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
                    }}
                    onPress={() => {
                        //if (isMounted) {
                        setNewPoints(() => []);
                        setX(0);
                        setY(0);
                        setZ(0);
                        setName("");
                        setError(null);
                        //}
                    }}
                >
                    <Text>Clear</Text>
                </TouchableOpacity>
            </View>
        </>}
    </View>
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
});