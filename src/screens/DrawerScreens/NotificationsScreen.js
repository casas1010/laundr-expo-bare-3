/*
card: 
  title: bold
  ------------
  body: regular

*/



import React, { useEffect, useState } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import GlobalStyles from "../../components/GlobalStyles";
import Header from "../../components/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Container from "../../components/Container";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

const NotificationsScreen = (props) => {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Header openDrawer={() => props.navigation.navigate("Home")} name="Notifications" />
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        horizontal={false}
        renderItem={({ item }) => {
          return (
            <Container>
              <Text>{item.title}</Text>
            </Container>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
export default NotificationsScreen;

