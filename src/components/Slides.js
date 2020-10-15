import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
  Button,
} from "react-native";
// import { Button } from "react-native-elements";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Slides = (props) => {
  return (
    <FlatList
      keyExtractor={(item) => item.text}
      data={props.data.SLIDE_DATA}
      horizontal
      pagingEnabled={true}
      renderItem={({ item, index }) => {
        return (
          <View style={[style.slideStyle, { backgroundColor: item.color }]}>
            <Text style={style.text}>{item.text}</Text>

            {props.data.SLIDE_DATA.length - 1 === index ? (
              <Button buttonStyle={style.button} title="Onwards!" onPress={props.onComplete} />
            ) : null}
          </View>
        );
      }}
    />
  );
};

const style = StyleSheet.create({
  slideStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  text: {
    fontSize: 30,
    color: "white",
  },
  button:{
      marginTop: 10
  }
});

export default Slides;
