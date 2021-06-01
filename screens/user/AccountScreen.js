import React, { useState, useEffect } from "react";
import { AdMobBanner, AdMobRewarded } from "expo-ads-admob";
import Constants from "expo-constants";
import { ADS } from "../../secrets";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  FlatList,
  Dimensions,
  SafeAreaView,
  Linking,
  Image,
} from "react-native";
import fb from "../../backend";
import Toast from "react-native-toast-message";
import { useNavigation } from "react-navigation-hooks";
import { connect } from "react-redux";
import actions from "../../actions";
const useFulLinks = [
  {
    url: "https://www.universalclass.com/articles/math/geometry/understanding-three-dimensional-geometry.htm",
    text: "Understanding 3D Geometry",
  },
  {
    url: "https://www.britannica.com/science/mathematics/Applied-geometry",
    text: "Applied Geometry",
  },
  {
    url: "http://ife.ens-lyon.fr/publications/edition-electronique/cerme6/wg5-13-mithalal.pdf",
    text: "3D Geometry and Learning of Mathematical Reasoning",
  },
  {
    url: "https://doubleroot.in/cheat-sheets/3d-geometry/",
    text: "Formulas",
  },
];
/*const testID = "ca-app-pub-3940256099942544/5224354917";
const testBannerID = "ca-app-pub-3940256099942544/6300978111";
const productionId = ADS.reward1.productionId;
const productionBannerId = ADS.banner3.productionId;
const adRewardUnitID = Constants.isDevice && !__DEV__ ? productionId : testID;
const adBannerUnitID = Constants.isDevice && !__DEV__ ? productionBannerId : testBannerID;*/
const mapDispatchToProps = (dispatch) => {
  return {
    reduxSetSaveItem: (items) => {
      dispatch(actions.setSaveItem(items));
    },
    reduxSetCurrentUser: (data) => {
      dispatch(actions.setCurrentUser(item));
    },
  };
};
const mapStateToProps = (state) => {
  return {
    saveComponents: state.saveComponents,
    miscData: state.miscData,
  };
};
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);
function AccountScreen(props) {
  const navigation = useNavigation();
  const [currUser, setCurrUser] = useState(fb.auth.currentUser);
  /*useEffect(() => {
    AdMobRewarded.setAdUnitID(adRewardUnitID).then(() => {
      try {
        AdMobRewarded.requestAdAsync();
      } catch (e) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: e.message,
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    });
  }, [props]);
  const showRewarded = async () => {
    try {
      await AdMobRewarded.showAdAsync();
    } catch (e) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: e.message,
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };*/
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/*<AdMobBanner
          bannerSize="fullBanner"
          adUnitID={adBannerUnitID} // Test ID, Replace with your-admob-unit-id
          servePersonalizedAds={true} // true or false
          onDidFailToReceiveAdWithError={() => {
            console.log("CANT");
          }}
        />*/}
      {currUser ? (
        <View style={{ flex: 1, ...styles.container }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
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
                fb.auth.signOut();
              }}
            >
              <Text>Log out</Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 15,
              margin: 5,
              marginBottom: 10,
            }}
          >
            Useful Materials
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={useFulLinks}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(item.url);
                }}
                style={{
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: "black",
                  alignItems: "center",
                  backgroundColor: "black",
                  borderRadius: 5,
                  padding: 10,
                  marginBottom: 5,
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            ...styles.container,
          }}
        >
          <Text>You are in a guest session</Text>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: "#4f75ff",
              marginTop: 10,
              borderRadius: 5,
            }}
            onPress={() => {
              navigation.navigate("Auth"); //, {}, NavigationActions.navigate({routeName: "Login"}))
            }}
          >
            <Text style={{ color: "white" }}>Log in</Text>
          </TouchableOpacity>
        </View>
      )}
      {/*<TouchableOpacity
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          marginBottom: 10,
          alignSelf: "center",
          borderRadius: 10,
          backgroundColor: "#64ff59",
        }}
        onPress={() => {
          showRewarded();
        }}
      >
        <Text style={{ textAlign: "center" }}>Watch an Ad to support me!</Text>
      </TouchableOpacity>*/}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
