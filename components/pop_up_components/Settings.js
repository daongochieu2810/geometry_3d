import React from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from "react-native";
const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;
export default function Settings({ existingShapes }) {
  return (
    <View
      style={{
        marginTop: 10,
        marginLeft: 15,
        marginBottom: 15,
      }}
    >
      <Text style={styles.title}>Testing</Text>
      <Text style={{ marginTop: 5 }}>Set camera perspective</Text>
      <FlatList
        data={existingShapes}
        extraData={existingShapes}
        style={{
          marginTop: 5,
          maxHeight: SCREEN_HEIGHT / 4,
        }}
        keyExtractor={(item) => `${item.id} to set`}
        renderItem={({ index, item }) => (
          <TouchableOpacity
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              borderRadius: 5,
              padding: 5,
              marginRight: 10,
              flexDirection: "row",
              marginBottom: 5,
            }}
            onPress={() => {}}
          >
            <View
              style={{ ...styles.circle, backgroundColor: item.color }}
            ></View>
            <Text style={{ textAlignVertical: "center", marginLeft: 5 }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
