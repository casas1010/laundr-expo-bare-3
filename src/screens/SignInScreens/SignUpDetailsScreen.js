import React, { Component, useState, useEffect } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GlobalStyles from "../../components/GlobalStyles";
import Container from "../../components/Container";
import MenuModal from "../../components/MenuModal";

// import City from "./City.js";
import SignUpCard from "../../components/SignUpCard";
import Password from "./Password.js";

import {
  WIDTH,
  FIELD_NAME_TEXT,
  FIELD_VALUE_TEXT,
  FIELD_VALUE_CONTAINER,
  BUTTON_CONTAINER,
  BUTTON,
} from "../../components/Items/";

import { CITIES } from "../../components/Data/";

const signUpDetailsScreen = (props) => {
  const [index, setIndex] = useState(0);
  const [city, setCity] = useState("Narnia"); //
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const [cityModalView, setCityModalView] = useState(false);
  //  MODAL VARIABLE
  const setCityHelper = (item) => {
    setCity(item);
    showModalCity();
  };
  const showModalCity = () => {
    console.log("showModalCity()");
    setCityModalView(!cityModalView);
  };
  const modalButtonHelper = () => {
    showModalCity();
  };
  //  MODAL VARIABLE

  const singUpAPI = () => {
    console.log("API SignUp initiated");
  };

  // contains information about signup in order of appearance
  const ITEMS = [
    {
      element: (
        <>
          <TouchableOpacity onPress={modalButtonHelper}>
            <Text style={[FIELD_NAME_TEXT, { marginBottom: 5 }]}>
              Select Your City
            </Text>
            <View style={FIELD_VALUE_CONTAINER}>
              <Text style={FIELD_VALUE_TEXT}>{city}</Text>
            </View>
          </TouchableOpacity>
          <MenuModal
            title="City"
            setCardTypeHelper={setCityHelper}
            showModal={showModalCity}
            modalView={cityModalView}
            data={CITIES}
          />
        </>
      ),
      value: "City",
    },

    {
      element: (
        <SignUpCard
          callBack={setName}
          title={"Name"}
          placeHolder="SkyWalker"
          textContentType="name"
          autoCompleteType="name"
        />
      ),
      value: "Name",
    },
    {
      element: (
        <SignUpCard
          callBack={setEmail}
          title={"Email"}
          placeHolder="dirty@laundry.com"
          textContentType="emailAddress"
          autoCompleteType="email"
          keyboardType="email-address"
        />
      ),
      value: "Email",
    },
    {
      element: (
        <SignUpCard
          callBack={setPhone}
          title={"Phone Number:"}
          placeHolder="xxx-xxx-xxxx"
          textContentType="telephoneNumber"
          autoCompleteType="tel"
          keyboardType="number-pad"
        />
      ),
      value: "PhoneNumber",
    },
    {
      element: (
        <Password setPassword1={setPassword1} setPassword2={setPassword2} />
      ),
      value: "Password",
    },
    {
      element: (
        <SignUpCard
          callBack={setReferralCode}
          title={"Referral Code"}
          placeHolder="Referral Code"
        />
      ),
      value: "Referral Code",
    },
  ];

  // main function
  const next = () => {
    console.log('next()')
    if (index === 5) {
      singUpAPI();
      return;
    }
    if (ITEMS.length > index + 1) {
      setIndex(index + 1);
      flatListRef.scrollToIndex({ animated: true, index: index + 1 });
    }
  };

  // PASSWORD LOGIC HELPER METHODS
  const isItALetter = (char) => {
    if (
      (char.charCodeAt(0) >= 65 && 90 >= char.charCodeAt(0)) ||
      (char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 122)
    ) {
      return true;
    }
    return false;
  };

  function specialCharValidation(str) {
    var iChars = "~`!#$%^@&*+=-[]\\';,/{}|\":<>?";
    for (var i = 0; i < str.length; i++) {
      if (iChars.indexOf(str.charAt(i)) != -1) {
        return true;
      }
    }
    return false;
  }
  function checkForCapitals(string) {
    for (character of string) {
      if (character == character.toUpperCase() && isItALetter(character)) {
        console.log("password passes capital test");
        return true;
      }
    }
    return false;
  }
  const passwordLogic = () => {
    if (password2 === "" && password1 === "") {
      Alert.alert("Please enter your password");
      return;
    }
    if (password1 !== password2) {
      Alert.alert("Your passwords need to match!");
      return;
    }
    console.log("passwords match");

    if (password1 === password2) {
      if (password2.length < 5) {
        Alert.alert("Your password needs to be at least 6 characters long");
        return;
      }
      console.log("password is at least 6 chat long");
      if (!specialCharValidation(password2)) {
        Alert.alert("Your password needs to have at least 1 special character");
        return;
      }
      console.log("password has at least 1 special character ");

      if (!checkForCapitals(password2)) {
        Alert.alert("Your password needs to have at least 1 capital letter ");
        return;
      }
      console.log("password contains at least 1 capital letter");
      console.log("password logic complete, password passed all tests");
    }
    next();
    // PASSWORD LOGIC
  };
  //password logic helper methods

  // nextHelper() verifies the forms fields are not empty
  // aswell as stats password logic flow
  // returns true if all requirements of password are met
  const nextHelper = () => {
    console.log("current card:", index + 1);
    if (index + 1 === 1 && city === "Narnia") {
      Alert.alert("Narnia does not exist, please select a real city");
      return;
    }
    if (index + 1 === 2 && name === "") {
      Alert.alert("Please enter your name");
      return;
    }
    if (index + 1 === 3 && email === "") {
      Alert.alert("Please enter your email");
      return;
    }
    if (index + 1 === 4 && phone === "") {
      Alert.alert("Please enter your phone");
      return;
    }

    // PASSWORD LOGIC
    if (index + 1 === 5) {
      passwordLogic();
      return;
    } else {
      next();
      console.log("new card: ", index + 2);
    }
  };

  const previous = () => {
    if (index === 0) {
      console.log("props.navigate: ", props.navigation.navigate("welcome"));
      return;
    }
    if (0 < index) {
      setIndex(index - 1);
      flatListRef.scrollToIndex({ animated: true, index: index - 1 });
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={ITEMS}
          scrollEnabled={false}
          horizontal
          extraData={index}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          ref={(ref) => {
            flatListRef = ref;
          }}
          keyExtractor={(item) => item.value}
          renderItem={({ item, index }) => {
            return <Container>{item.element}</Container>;
          }}
        />

        <View style={styles.masterButtonContainer}>
          <BUTTON
            onPress={previous}
            text={index == 0 ? "Return" : "Previous"}
            style={{ width: WIDTH * 0.35 }}
          />

          <View style={styles.indexCounterContainer}>
            <Text>
              {index + 1} / {ITEMS.length}
            </Text>
          </View>

          <BUTTON
            onPress={nextHelper}
            text={index == 5 ? "Submit" : "Next"}
            style={{ width: WIDTH * 0.35 }}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  masterButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  indexCounterContainer: {
    width: WIDTH * 0.2,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default signUpDetailsScreen;
