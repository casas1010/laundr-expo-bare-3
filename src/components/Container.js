import React from "react";
import { View, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";

const WIDTH = Dimensions.get("window").width;

export default Container = (props) => {
  return (
    <Animatable.View animation="zoomIn" iterationCount={1}>

    <View
      style={{
        backgroundColor: "white",
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 15,
        margin: WIDTH * 0.025,
        padding: 10,
        width: WIDTH * 0.95,
        // alignItems: "center",
        // justifyContent: "center",
        ...props.style,
      }}
    >
      {props.children}
    </View>
    </Animatable.View>
  );
};
