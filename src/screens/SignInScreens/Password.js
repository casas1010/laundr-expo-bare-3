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
} from "../../components/Items/";

//*
// note 1: discuss how to use auto size text: https://stackoverflow.com/questions/5033012/auto-scale-textview-text-to-fit-within-bounds
//*

const Password = (props) => {
  useEffect(() => {
    console.log(`card Password loaded`);
  }, []);

  return (
    <>
      <Text style={[FIELD_NAME_TEXT,{marginBottom:5}]}>Create a Password</Text>

      <TextInput
        onChangeText={(txt) => props.setPassword1(txt)}
        placeholder="Password"
        textContentType="password"
        autoCompleteType="password"
        autoCorrect={false}
        secureTextEntry={true}
        style={[FIELD_VALUE_CONTAINER, { marginBottom: 10 }]}
      />
      <TextInput
        style={[FIELD_VALUE_CONTAINER, { marginBottom: 10 }]}
        onChangeText={(txt) => {
          props.setPassword2(txt);
        }}
        placeholder="Confirm Password"
        textContentType="password"
        autoCompleteType="password"
        autoCorrect={false}
        secureTextEntry={true}
      />
      <Text>Password requirements:</Text>
      <Text>6 characters, 1 capital letter, and 1 special character</Text>
    </>
  );
};

export default Password;
