import React, { Component, useRef } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Button,
} from "react-native";
import { HEIGHT, WIDTH } from "../../src/components/Items/";


export default class Loader extends Component {
  UNSAFE_componentWillMount() {
    console.log('UNSAFE_componentWillMount() requires change')
    this.animatedValue = new Animated.Value(0);
    console.log("Loader element displaying");
  }
  componentDidMount() {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 8000,
    }).start();
    setTimeout(() => {
      Animated.timing(this.animatedValue, {
        toValue: 50,
        duration: 4000,
      }).start();
    }, 8000);
  }

  render() {
    const interpolateRotation = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0rad", "10rad"],
    });
    const animatedStyle = {
      transform: [{ rotate: interpolateRotation }],
    };
    return (
      <View style={[styles.container,{...this.props.style}]}>
          <Image
            style={{
              height: WIDTH * 0.25,
              width: WIDTH * 0.9,
              borderWidth: 0,
            }}
            source={require("../assets/Launch_Logo.png")}
          />
          {/*  */}
          {/*  */}
          <Animated.View
            style={[
              {
                position: "absolute",
                left: WIDTH * 0.25 * 0.23,
                top: WIDTH * 0.9 * 0.056,
              },
              animatedStyle,
            ]}
          >
            <Image
              style={{
                height: WIDTH * 0.25 * 0.59,
                width: WIDTH * 0.25 * 0.59,
              }}
              source={require("../assets/spinner.png")}
            />
          </Animated.View>
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    
  },
  box: {},
  text: {
    color: "#FFF",
  },
});

AppRegistry.registerComponent("Loader", () => Loader);
