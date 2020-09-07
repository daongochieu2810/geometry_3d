import { StatusBar } from "expo-status-bar";
import { SplashScreen, AppLoading } from "expo";
import React, { useState } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { StyleSheet, Animated , View, Text} from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons } from "@expo/vector-icons";
import { enableScreens } from "react-native-screens";
import HomeScreen from "./screens/home/HomeScreen";
import LoadingScreen from "./screens/LoadingScreen";
import SavedItemScreen from "./screens/user/SavedItemScreen";
import AccountScreen from "./screens/user/AccountScreen";

import CubeScreen from "./screens/cube/CubeScreen";
import PrismScreen from "./screens/prism/PrismScreen";
import SphereScreen from "./screens/sphere/SphereScreen";
import OctahedronScreen from "./screens/octahedron/OctahedronScreen";
import BaseLayoutScreen from "./screens/BaseLayoutScreen";
import ConeScreen from "./screens/cone/ConeScreen";

import globalStorage from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Spinner from "./Spinner";
import Toast from "react-native-toast-message";

import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";

enableScreens();

const AuthStack = createStackNavigator(
  {
    Login: LoginScreen,
    Register: RegisterScreen,
  },
  {
    headerMode: "none",
  }
);
const AppBottomNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-home" size={24} color={tintColor} />
        ),
      },
    },
    Items: {
      screen: SavedItemScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-albums" size={24} color={tintColor} />
        ),
      },
    },
    Account: {
      screen: AccountScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-contact" size={24} color={tintColor} />
        ),
      },
    },
  },
  {
    headerMode: "none",
    initialRouteName: "Home",
  }
);
const Object3DNavigator = createStackNavigator(
  {
    CubeScreen: {
      screen: (props) => <CubeScreen initShape={"cube"} {...props} />,
    },
    SphereScreen: {
      screen: (props) => <SphereScreen initShape={"sphere"} {...props} />,
    },
    BaseLayoutScreen: {
      screen: (props) => (
        <BaseLayoutScreen
          initShape={""}
          params={
            props.navigation && props.navigation.state
              ? props.navigation.state.params
              : null
          }
        />
      ),
    },
    ConeScreen: {
      screen: (props) => <ConeScreen initShape={"cone"} {...props} />,
    },
    OctahedronScreen: {
      screen: (props) => (
        <OctahedronScreen initShape={"octahedron"} {...props} />
      ),
    },
    PrismScreen: {
      screen: (props) => <PrismScreen initShape={"prism"} {...props} />,
    }
  },
  {
    headerMode: "none",
  }
);

const AppNavigator = createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppBottomNavigator,
      Auth: AuthStack,
      Objects: Object3DNavigator,
    },
    {
      initialRouteName: "Loading",
    }
  )
);
export default function App() {
  console.disableYellowBox = true;
  return (
    <Provider store={globalStorage.store}>
      <PersistGate
        persistor={globalStorage.persistor}
        loading={<Spinner visible={true} />}
      >
        <AppNavigator />
       <Toast ref={(ref) => Toast.setRef(ref)} />
          <StatusBar style="dark" translucent={true} />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
