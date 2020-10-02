import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const BottomMenuItem = ({ iconName, isCurrent }) => {
  return (
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons
        name={iconName}
        size={32}
        style={{ color: isCurrent ? "blue" : "grey" }}
      />
    </View>
  );
};
