import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Picker,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Post from "./components/Post";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const dummyData = [
  {
    username: "Dao Ngoc Hieu",
    userImage:
      "https://scontent-xsp1-1.xx.fbcdn.net/v/t1.0-9/78794853_2434835663499592_1312362149607112704_o.jpg?_nc_cat=110&_nc_sid=09cbfe&_nc_ohc=mu5uE-CdCDcAX_hW8h2&_nc_ht=scontent-xsp1-1.xx&oh=1f0cdf3f26060e687a394d7d98449908&oe=5F9C5585",
    title: "Amazing Geometry 1",
    content: "Amazing Geometry",
    image:
      "https://previews.123rf.com/images/wimcia1978/wimcia19781308/wimcia1978130800107/21700393-3d-geometry-infographics-vector-illustration.jpg",
  },
  {
    username: "Dao Ngoc Hieu",
    userImage:
      "https://scontent-xsp1-1.xx.fbcdn.net/v/t1.0-9/78794853_2434835663499592_1312362149607112704_o.jpg?_nc_cat=110&_nc_sid=09cbfe&_nc_ohc=mu5uE-CdCDcAX_hW8h2&_nc_ht=scontent-xsp1-1.xx&oh=1f0cdf3f26060e687a394d7d98449908&oe=5F9C5585",

    title: "Amazing Geometry 2",
    content: "Amazing Geometry",
    image:
      "https://previews.123rf.com/images/wimcia1978/wimcia19781308/wimcia1978130800107/21700393-3d-geometry-infographics-vector-illustration.jpg",
  },
  {
    username: "Dao Ngoc Hieu",
    userImage:
      "https://scontent-xsp1-1.xx.fbcdn.net/v/t1.0-9/78794853_2434835663499592_1312362149607112704_o.jpg?_nc_cat=110&_nc_sid=09cbfe&_nc_ohc=mu5uE-CdCDcAX_hW8h2&_nc_ht=scontent-xsp1-1.xx&oh=1f0cdf3f26060e687a394d7d98449908&oe=5F9C5585",

    title: "Amazing Geometry 3",
    content: "Amazing Geometry",
    image:
      "https://previews.123rf.com/images/wimcia1978/wimcia19781308/wimcia1978130800107/21700393-3d-geometry-infographics-vector-illustration.jpg",
  },
];
export default function FeedScreen() {
  const [posts, setPosts] = useState(null);

  const getPostsWithImageSizes = async () => {
    let _posts = [];
    for (let item of dummyData) {
      let imageHeight = 0;
      await Image.getSize(item.image, (width, height) => {
        // calculate image width and height
        const scaleFactor = width / (SCREEN_WIDTH * 0.8);
        imageHeight = height / scaleFactor;
      });
      _posts.push({
        ...item,
        imageHeight,
      });
    }
    return _posts;
  };

  useEffect(() => {
    if (dummyData.length > 0) {
      getPostsWithImageSizes().then((data) => setPosts(data));
    }
  }, [dummyData]);

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
          data={posts}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => "feed " + item.title}
          renderItem={({ item }) => (
            <View style={styles.feedItem}>
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 5,
                }}
              >
                <Image
                  source={{
                    uri: item.userImage,
                  }}
                  style={styles.avatar}
                />
                <Text style={{ marginLeft: 10, fontWeight: "bold" }}>
                  {item.username}
                </Text>
                <Picker
                  style={{
                    height: 50,
                    width: 50,
                    marginLeft: SCREEN_WIDTH * 0.25,
                  }}
                  onValueChange={
                    (itemValue, itemIndex) => {} //setSelectedValue(itemValue)
                  }
                >
                  <Picker.Item label="Edit" value="edit" />
                  <Picker.Item label="Delete" value="delete" />
                </Picker>
              </View>
              <Text
                style={{
                  margin: 5,
                  marginBottom: 10,
                }}
              >
                {item.content}
              </Text>
              <Image
                source={{
                  uri: item.image,
                }}
                style={{
                  width: SCREEN_WIDTH * 0.8,
                  height: item.imageHeight,
                  alignSelf: "center",
                  borderRadius: 5,
                }}
              />
              <View style={styles.bottomPost}>
                <TouchableOpacity>
                  <Ionicons size={28} name="ios-bulb" color="gray" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons size={28} name="ios-chatboxes" color="gray" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons size={28} name="ios-git-branch" color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
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
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  bottomPost: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 7,
    marginTop: 10,
  },
  icon: {
    width: 16,
    height: 16,
  },
});
