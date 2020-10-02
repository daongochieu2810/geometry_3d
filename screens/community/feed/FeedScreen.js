import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const dummyData = [
  {
    title: "Amazing Geometry 1",
    content: "Amazing Geometry",
    image:
      "https://previews.123rf.com/images/wimcia1978/wimcia19781308/wimcia1978130800107/21700393-3d-geometry-infographics-vector-illustration.jpg",
  },
  {
    title: "Amazing Geometry 2",
    content: "Amazing Geometry",
    image:
      "https://previews.123rf.com/images/wimcia1978/wimcia19781308/wimcia1978130800107/21700393-3d-geometry-infographics-vector-illustration.jpg",
  },
  {
    title: "Amazing Geometry 3",
    content: "Amazing Geometry",
    image:
      "https://previews.123rf.com/images/wimcia1978/wimcia19781308/wimcia1978130800107/21700393-3d-geometry-infographics-vector-illustration.jpg",
  },
];
export default function FeedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          <Text style={styles.title}>Geometry feed</Text>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={{ color: "white" }}>Refresh</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={dummyData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => "feed " + item.title}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.feedItem}>
              <Image
                source={{
                  uri: item.image,
                }}
                style={{
                    width: SCREEN_WIDTH * 0.8,
                    height: SCREEN_HEIGHT * 0.1,
                    alignSelf: "center"
                }}
              />
              <Text style={{
                  margin: 5
              }}>{item.title}</Text>
              <Text style={{
                  margin: 5
              }}>{item.content}</Text>
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
    paddingVertical: 10,
    flex: 1,
  },
  title: {
    fontSize: 20,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: "#41fc03",
  },
  feedItem: {
    width: SCREEN_WIDTH * 0.88,
    padding: 10,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "black",
    alignSelf: "center",
    marginTop: 15,
  },
});
