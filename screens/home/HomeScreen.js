import React, { useRef } from "react";
import Constants from "expo-constants";
import { AdMobBanner } from "expo-ads-admob";
import { ADS } from "../../secrets";
import {
  Animated,
  Dimensions,
  FlatList,
  View,
  Text,
  SafeAreaView,
} from "react-native";
import AnimatedCard from "../../components/common/AnimatedCard";
import CardContext from "../../components/contexts/CardContext";
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
/*const testID = "ca-app-pub-3940256099942544/6300978111";
const productionId = ADS.banner1.productionId;
const adUnitID = Constants.isDevice && !__DEV__ ? productionId : testID;*/

const useLazyRef = (initializer) => {
  const ref = useRef();
  if (ref.current === undefined) {
    ref.current = initializer();
  }
  return ref.current;
};
const { width } = Dimensions.get("window");
const ratio = 228 / 362;
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = CARD_WIDTH * ratio;
const cards = [
  {
    index: 0,
    name: "Blank",
    pic: require("../../assets/misc_shapes.png"),
    path: "BaseLayoutScreen",
  },
  {
    index: 1,
    name: "Cube",
    pic: require("../../assets/cube.png"),
    path: "CubeScreen",
  },
  {
    index: 2,
    name: "Octahedron",
    pic: require("../../assets/octahedron.png"),
    path: "OctahedronScreen",
  },
  {
    index: 3,
    name: "Cone",
    pic: require("../../assets/cone.png"),
    path: "ConeScreen",
  },
  {
    index: 4,
    name: "Sphere",
    pic: require("../../assets/sphere.png"),
    path: "SphereScreen",
  },
  {
    index: 5,
    name: "Prism",
    pic: require("../../assets/prism.png"),
    path: "PrismScreen",
  },
];
export const AnimatedObjectList = ({
  data,
  isHorizontal,
  cardW,
  cardH,
  _eventEmitter,
}) => {
  const y = useLazyRef(() => new Animated.Value(0));
  const onScroll = useLazyRef(() =>
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: { y },
          },
        },
      ],
      { useNativeDriver: true }
    )
  );
  return (
    <AnimatedFlatList
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      bounces={false}
      {...{ onScroll }}
      data={data}
      style={{
        marginTop: isHorizontal ? 0 : 5,
        marginHorizontal: 5,
      }}
      horizontal={isHorizontal}
      renderItem={({ index, item: { name, pic, path } }) => (
        <CardContext.Provider
          value={{
            y: y,
            index: index,
            name: name,
            pic: pic,
            path: path,
            cardW: cardW,
            cardH: cardH,
            isHorizontal: isHorizontal,
            eventEmitter: _eventEmitter,
          }}
        >
          <AnimatedCard
            {...{ index, y, name, pic, path, cardW, cardH, isHorizontal }}
          />
        </CardContext.Provider>
      )}
      keyExtractor={(item) => `${item.index} home items`}
    />
  );
};
const HomeScreen = () => {
  return (
    <SafeAreaView>
      {/*<AdMobBanner
        bannerSize="fullBanner"
        adUnitID={adUnitID} // Test ID, Replace with your-admob-unit-id
        servePersonalizedAds={true} // true or false
        onDidFailToReceiveAdWithError={() => {
          console.log("CANT");
        }}
      />*/}

      <AnimatedObjectList
        data={cards}
        cardW={CARD_WIDTH}
        cardH={CARD_HEIGHT}
        isHorizontal={false}
        _eventEmitter={null}
      />
    </SafeAreaView>
  );
};
export default HomeScreen;
