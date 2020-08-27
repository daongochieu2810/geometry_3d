import React, {useState, useEffect} from "react";
import {Text, View, StyleSheet, TouchableOpacity, LayoutAnimation, Dimensions} from "react-native";
import fb from "../../backend";
import { useNavigation} from 'react-navigation-hooks'
import {connect} from 'react-redux';
import actions from "../../actions";
const mapDispatchToProps = (dispatch) => {
    return {
        reduxSetSaveItem: (items) => {
            dispatch(actions.setSaveItem(items));
        },
        reduxSetCurrentUser: (data) => {
            dispatch(actions.setCurrentUser(item));
        }
    };
};
const mapStateToProps = (state) => {
    return {
        saveComponents: state.saveComponents,
        miscData: state.miscData,
       // basicComponents: state.basicComponents
    };
};
const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);
function AccountScreen(props) {
    const navigation = useNavigation();
    const [currUser, setCurrUser] = useState(fb.auth.currentUser);
  return (
    <View style={styles.container}>
        {currUser ?
            <><View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 25 }}>
        <Text style={{ fontSize: 20 }}>Personal account</Text>
        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderWidth: 1,
            borderColor: "black",
            borderRadius: 5,
          }}
          onPress={() => {
              props.reduxSetSaveItem([]);
              //props.setCurrentUser(null);
              fb.auth.signOut()
          }}
        >
          <Text>Log out</Text>
        </TouchableOpacity>
      </View></> : <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
                <Text>You are in a guest session</Text>
                <TouchableOpacity style={{
                    padding: 10,
                    backgroundColor: "#4f75ff",
                    marginTop: 10,
                    borderRadius: 5
                }} onPress={() => {
                    navigation.navigate("Auth")//, {}, NavigationActions.navigate({routeName: "Login"}))
                }}>
                    <Text style={{color: "white"}}>Log in</Text>
                </TouchableOpacity>
            </View> }
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1
  },
});
