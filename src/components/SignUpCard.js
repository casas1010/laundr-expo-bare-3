import React, { Component, useState, useEffect } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  FlatList,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";

import {
  WIDTH,
  FIELD_NAME_TEXT,
  FIELD_VALUE_TEXT,
  FIELD_VALUE_CONTAINER,
  BUTTON_CONTAINER,
} from "./Items/";

//*
// note 1: discuss how to use auto size text: https://stackoverflow.com/questions/5033012/auto-scale-textview-text-to-fit-within-bounds
//*

const SignUpCard = (props) => {
  useEffect(() => {
    console.log(`card "${props.title}" loaded`);
    console.log("FIELD_NAME_TEXT:  ", FIELD_NAME_TEXT);
  }, []);

  return (
    <>
      {/* note 1 */}
      <Text style={[FIELD_NAME_TEXT, { marginBottom: 5 }]}>{props.title}</Text>
      <TextInput
        style={FIELD_VALUE_CONTAINER}
        onChangeText={(text) => props.callBack(text)}
        placeholder={props.placeHolder}
        textContentType={props.textContentType}
        autoCompleteType={props.autoCompleteType}
        autoCorrect={false}
        keyboardType={props.keyboardType}
        secureTextEntry={props.secureTextEntry}
      />
    </>
  );
};

// default properties
SignUpCard.defaultProps = {
  textContentType: "none",
  autoCompleteType: "off",
  keyboardType: "default",
  secureTextEntry: false,
};

export default SignUpCard;
