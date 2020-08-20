import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ImageBackground,
  StatusBar,
  LayoutAnimation,
  Dimensions,
  Image,
} from "react-native";
import fb from "../../backend.js";
import { useNavigation, useNavigationParam } from "react-navigation-hooks";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LoadingScreen from "../LoadingScreen";

export default function RegisterScreen() {
  const navigate = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const handleRegister = () => {
    if (errorMessage === "") {
      setVisible(() => true);
      fb.auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
          setVisible(() => false);
          fb.userCollection.doc(userCredentials.user.uid).set({
            scenes: [],
            uid: userCredentials.user.uid
          });
          return userCredentials.user.updateProfile({
            displayName: name,
          });
        })
        .catch((error) => {
          setVisible(() => false);
          setErrorMessage(error);
        });
    }
  };
  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
  });
  return visible ? (
    <LoadingScreen />
  ) : (
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      scrollEnabled={true}
      enableAutomaticScroll={Platform.OS === "ios"}
    >
      <StatusBar barStyle="light-content"></StatusBar>
      <ScrollView
          keyboardShouldPersistTaps={"handled"}
        style={{
          height: "100%",
          backgroundColor: 'black'
        }}
      >
        <TouchableOpacity style={styles.back} onPress={() => navigate.goBack()}>
          <Ionicons name="ios-arrow-round-back" color="white" size={32} />
        </TouchableOpacity>
        <Text style={styles.greeting}>{"Become one of us"}</Text>
        <View style={styles.errorMessage}>
          <Text style={styles.error}>{errorMessage.message}</Text>
        </View>
        <View style={styles.form}>
          <View>
            <Text style={styles.inputTitle}>Name</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={(nameInput) => setName(() => nameInput)}
              value={name}
            ></TextInput>
          </View>
          <View>
            <Text style={styles.inputTitle}>Email Address</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={(emailInput) => setEmail(() => emailInput)}
              value={email}
            ></TextInput>
          </View>
          <View>
            <Text style={styles.inputTitle}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={(password) => setPassword(() => password)}
              value={password}
            ></TextInput>
          </View>
          <View>
            <Text style={styles.inputTitle}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={(passwordInput) => {
                //setPasswordConfirm(passwordInput)
                if (passwordInput != password)
                  setErrorMessage(() => "Incorrect Passwords");
                else setErrorMessage(() => "");
              }}
            ></TextInput>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={{ color: "white", fontWeight: "500" }}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    top: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  container: {
    flexGrow: 1,
  },
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    width: "37%",
    alignSelf: "center",
    color: "white",
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  form: {
    marginBottom: 40,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: "white",
    fontSize: 10,
    textTransform: "uppercase",
  },
  input: {
    borderBottomColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "white",
    marginBottom: 20,
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#478eff",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  back: {
    position: "absolute",
    top: 32,
    left: 32,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
