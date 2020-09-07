import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  Modal,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "react-navigation-hooks";

const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state) => {
  return {
    basicComponents: state.basicComponents,
  };
};
const { height, width } = Dimensions.get("window");

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
function SettingScreen(props) {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Text style={{ fontSize: 20, textAlignVertical: 'center' }}>Settings</Text>
      </View>
      <View style={styles.section}>
        <Text style={{fontSize: 18}}>All shapes</Text>
        <FlatList
          style={styles.flatList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={({ index, item }) => {
            return index + "shape";
          }}
          data={props.basicComponents.shapes}
          renderItem={({ item }) => (
            <TouchableOpacity style={{...styles.touchableItem, backgroundColor: item.color}}>
              <Text>Shape</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  section: {
    marginTop: 10,
  },
  flatList: {
    paddingVertical: 10,
  },
  touchableItem: {
    padding: 10,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 10
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  }
});
