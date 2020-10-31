/*
code clean up 100% complete
wire up actions



*/
import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import GlobalStyles from "../../components/GlobalStyles";
import Header from "../../components/Header";
import {
  HEIGHT,
  FIELD_NAME_TEXT,
  BUTTON,
  FIELD_VALUE_FONT_SIZE,
} from "../../components/Items/";
import Container from "../../components/Container";

import { connect } from "react-redux";
import * as actions from '../../actions';

const HelpScreen = (props) => {
  const [issue, setIssue] = useState();

  useEffect(() => {
    console.log("HelpScreen loaded");
  }, []);

  const submitFunction = () => {
    console.log("submit press");
  };

  //   const instaFunction =()=>{
  //       console.log('instagram')
  //   }

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Header openDrawer={() => props.navigation.navigate("Home")} name="Help" />
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
      >
        <Container>
          <View style={styles.headerTextContainer}>
            <Text style={FIELD_NAME_TEXT}>Report an Issue</Text>
          </View>
          <TextInput
            value={issue}
            maxLength={500}
            multiline={true}
            onChangeText={(txt) => setIssue(txt)}
            //   placeholder=" Name"
            style={styles.inputBox}
          />
          <View style={styles.buttonContainer}>
            <BUTTON onPress={submitFunction} text="Submit" />
          </View>
        </Container>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },
  inputBox: {
    width: "100%",
    height: HEIGHT * 0.26,
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 7,
    fontSize: FIELD_VALUE_FONT_SIZE,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    // flexDirection: "row",
  },
});
export default connect(null,actions)(HelpScreen);
