import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useNavigationParam } from "react-navigation-hooks";
import fb from "../backend";
import Spinner from "../Spinner";
export default function LoadingScreen() {
  const { navigate } = useNavigation();
  useEffect(() => {
    fb.auth.onAuthStateChanged((user) => {
      navigate(user ? "App" : "Auth");
    });
  });
  return (
    <View style={styles.container}>
      <Spinner visible={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
