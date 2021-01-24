import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  LayoutAnimation,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import fb from "../../backend";
import actions from "../../actions";
import { connect } from "react-redux";
import LoadingScreen from "../LoadingScreen";
import {NavigationActions} from "react-navigation";

function LoginScreen(props) {
  const { navigate } = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const handleLogin = () => {
    setVisible(() => true);
    fb.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        props.reduxSetCurrentUser({
          email: email,
          password: password,
        });
        setVisible(() => false);
        //console.log(props.currentUser);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setVisible(() => false);
      });
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
      <ScrollView keyboardShouldPersistTaps={'handled'} style={{backgroundColor: 'black'}}>
        <Text style={styles.greeting}>{"Hello! \nWelcome back"}</Text>
        <View style={styles.errorMessage}>
          <Text style={styles.error}>{errorMessage}</Text>
        </View>
        <View style={styles.form}>
          <View>
            <Text style={styles.inputTitle}>Email Address</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={(emailInput) => setEmail(() => emailInput.trim())}
              value={email}
            ></TextInput>
          </View>
          <View>
            <Text textBreakStrategy={"simple"} style={styles.inputTitle}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={(passwordInput) => setPassword(() => passwordInput.trim())}
              value={password}
            ></TextInput>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text textBreakStrategy={"simple"} style={{ color: "white", fontWeight: "500" }}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.button, marginTop: 10, backgroundColor: "#2bffea"}} onPress={() => {
            navigate("App", {}, NavigationActions.navigate({routeName: "HomeScreen"}))
          }}>
            <Text textBreakStrategy={"simple"} style={{ color: "black", fontWeight: "500" }}>Guest session</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignSelf: "center", marginTop: 32 }}
            onPress={() => navigate("Register")}
          >
            <Text textBreakStrategy={"simple"} style={{ color: "white", fontSize: 13 }}>
              First time?
              <Text textBreakStrategy={"simple"} style={{ color: "#478eff", fontWeight: "500" }}>
                {" "}
                Sign up!
              </Text>
            </Text>
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
    right: 0,
    bottom: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
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
    fontSize: 10,
    textTransform: "uppercase",
    color: "white",
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
});
const mapDispatchToProps = (dispatch) => {
  return {
    reduxSetCurrentUser: (user) => dispatch(actions.setCurrentUser(user)),
  };
};
const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser.user,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
