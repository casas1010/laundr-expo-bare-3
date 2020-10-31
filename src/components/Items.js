import React, { Component, useRef } from "react";
// import * as Animatable from "react-native-animatable";

import {
  Dimensions,
  Animated,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
} from "react-native";

export const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10001,
    }).start();
  }, [fadeAnim]);

  return (
    <View
      style=
      {{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
      >{props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    backgroundColor: "white",
    height: 120,
    width: 120,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export const DIVIDER = (props) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
        ...props.containerStyle,
      }}
    >
      <View
        style={[
          {
            height: 1,
            width: "100%",
            backgroundColor: "grey",
          },
          { ...props.style },
        ]}
      />
    </View>
  );
};

export const HEIGHT = Dimensions.get("window").height;
export const WIDTH = Dimensions.get("window").width;

export const FIELD_NAME_FONT_SIZE = Math.floor((WIDTH * 0.1) / 1.7);
export const FIELD_VALUE_FONT_SIZE = Math.floor((WIDTH * 0.1) / 2);

export const BUTTON_TEXT_FONT_SIZE = Math.floor((WIDTH * 0.1) / 2);

export const KEYBOARD_AWARE_SCROLL_VIEW_STYLE = {
  backgroundColor: "#f8f9fa",
  flex: 1,
};

// export const IMAGE = (props) => {
//   return <Image
//     style={{
//       height: WIDTH * 0.35,
//       width: WIDTH * 0.35,
//       borderWidth: 0,
//     }}
//     source={'require(../assets/Scentedg.png)'}
//   />;
// };

const SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 1, height: 1 },
  shadowOpacity: 0.4,
  shadowRadius: 3,
  elevation: 5,
};

export const FIELD_NAME_TEXT = {
  fontSize: FIELD_NAME_FONT_SIZE,
  fontWeight: "bold",
};

export const FIELD_VALUE_TEXT = {
  fontSize: FIELD_VALUE_FONT_SIZE,
  fontWeight: "bold",
  width: "100%",
};

export const FIELD_VALUE_CONTAINER = {
  width: "100%",
  borderColor: "#d3d3d3",
  borderWidth: 1,
  borderRadius: 8,
  padding: 7,
  fontSize: FIELD_VALUE_FONT_SIZE,
  justifyContent: "center",
  alignItems: "center",
};

export const BUTTON_CONTAINER = {
  alignItems: "center",
  backgroundColor: "#01c9e2",
  // backgroundColor:'red',
  margin: 10,
  width: "80%",
  borderRadius: 20,
  ...SHADOW,
};

export const BUTTON_TEXT = {
  fontSize: BUTTON_TEXT_FONT_SIZE,
  fontWeight: "bold",
  color: "white",
  padding: 10,
};

export const BUTTON = (props) => {
  return (
      <TouchableOpacity
        style={[BUTTON_CONTAINER, { ...props.style }]}
        onPress={props.onPress}
      >
        <Text style={[BUTTON_TEXT, { ...props.textStyle }]}>
          {props.text || props.children}
        </Text>
      </TouchableOpacity>
  );
};

export const findProductIndex = (products, id) => {
  return products.findIndex((product) => product.id === id);
};

export const roundDecimals = (number, decimals = 2) => {
  return Math.round(number * 10 ** decimals) / 10 ** decimals;
};
