import React, { useState, useRef, useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  AsyncStorage,
} from "react-native";
// import jwtDecode from "jwt-decode";
// import { MaterialIcons } from "@expo/vector-icons";
// import { FontAwesome5 } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GlobalStyles from "../../components/GlobalStyles";
import Container from "../../components/Container";
import MenuModal from "../../components/MenuModal";
// import { AppLoading } from "expo";
import axios from "axios";

import _ from "lodash";
import { connect } from "react-redux";

import * as actions from "../../actions/index";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  HEIGHT,
  FIELD_NAME_FONT_SIZE,
  FIELD_VALUE_FONT_SIZE,
  WIDTH,
  BUTTON,
  INPUT_TITLE,
  FIELD_VALUE_CONTAINER,
  BUTTON_TEXT,
  BUTTON_CONTAINER,
  KEYBOARD_AWARE_SCROLL_VIEW_STYLE,
} from "../../components/Items/";
import Loader from "../../components/Loader";

import { USERTYPES } from "../../components/Data/";

const WelcomeScreen = (props) => {
  const [email, setEmail] = useState("u1@gmail.com");
  const [password, setPassword] = useState("U11234!");
  const [userType, setUserType] = useState("User");
  const [userModalView, setUserModalView] = useState(false);
  const [size, setSize] = useState(FIELD_VALUE_FONT_SIZE * 1.3);

  // REDUX LOGIN FLOW
  const loginWithEmail = async () => {
    console.log("loginWithEmail() initiated");
    props.emailLogin({ email, password, userType });
    onAuthComplete(props);
    console.log("emailLogin() complete");
  };

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    onAuthComplete(props);
  }, [props.token]);
  
  const onAuthComplete = (props) => {
    // console.log("props.token  :", props.token);
    if (props.token) {
      props.navigation.navigate("drawer");
    }
  };
  // REDUX LOGIN FLOW

  //  MODAL VARIABLE
  const setUserHelper = (item) => {
    setUserType(item);
    showModalUser();
  };
  const showModalUser = () => {
    console.log("showModalUser()");
    setUserModalView(!userModalView);
  };
  const modalButtonHelper = () => {
    showModalUser();
  };
  //  MODAL VARIABLE

  // ANIMATION
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    fadeIn();
  }, []);

  // ANIMATION

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={KEYBOARD_AWARE_SCROLL_VIEW_STYLE}
        showsVerticalScrollIndicator={false}
        // style={{ justifyContent: "center", alignItems: "center" }}
      >
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <View
            style={{
              // loader container
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader />
          </View>
          <Animated.View
            style={{
              opacity: fadeAnim,
              alignItems: "center",
            }}
          >
            <Text style={styles.animatedText}>Explore More. Stress Less</Text>
          </Animated.View>

          <Container>
            <TouchableOpacity
              onPress={modalButtonHelper}
              style={[FIELD_VALUE_CONTAINER, { width: 65, marginBottom: 5 }]}
            >
              <Text>{userType}</Text>
            </TouchableOpacity>
            <MenuModal
              title="Select User Type"
              setCardTypeHelper={setUserHelper}
              showModal={showModalUser}
              modalView={userModalView}
              data={USERTYPES}
            />

            <View
              style={[styles.container_Email_Password, { marginBottom: 5 }]}
            >
              <Icon
                name="user"
                color={"black"}
                size={size}
                style={{ marginRight: 10 }}
              />
              <TextInput
                value={email}
                onChangeText={(email) => setEmail(email)}
                placeholder=" Email"
                style={[FIELD_VALUE_CONTAINER, { width: "80%" }]}
              />
            </View>

            <View style={styles.container_Email_Password}>
              <Icon
                name="lock"
                color={"black"}
                size={size}
                style={{ marginRight: 10 }}
              />
              <TextInput
                value={password}
                onChangeText={(password) => setPassword(password)}
                secureTextEntry={true}
                placeholder=" Password"
                style={[FIELD_VALUE_CONTAINER, { width: "80%" }]}
              />
            </View>
          </Container>
          <View style={styles.buttonsContainer}>
            <BUTTON onPress={loginWithEmail} text="LOG IN" />
            <BUTTON
              onPress={() => props.navigation.navigate("signUpDetails")}
              text="SIGN UP"
            />

            <TouchableOpacity
              onPress={() => props.navigation.navigate("forgotPassword")}
            >
              <Text style={[BUTTON_TEXT, { color: "black" }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: 10,
    alignItems: "center",
  },
  animatedText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    // fontFamily:'Calmer Bold'
  },
  container_Email_Password: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    height: 30,
    width: 30,
    // backgroundColor: "red",
  },
  buttonsContainer: {
    alignItems: "center",
    justifyContent: "center",
    width:WIDTH,
    // backgroundColor:'green'
  },
  button: {
    alignItems: "center",
    backgroundColor: "#01c9e2",
    margin: 10,
    // height: 20,
    width: 250,
    borderRadius: 10,
  },
  buttonText: {
    padding: 10,
    fontSize: 15,
  },
});

function mapStateToProps({ auth }) {
  return { token: auth.token };
}

export default connect(mapStateToProps, actions)(WelcomeScreen);
