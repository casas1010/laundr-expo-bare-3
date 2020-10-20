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
  Modal,
  Alert,
} from "react-native";
import { connect } from "react-redux";

import axios from "axios";
import * as actions from "../../actions/index";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GlobalStyles from "../../components/GlobalStyles";
import Container from "../../components/Container";
import MenuModal from "../../components/MenuModal";
import { BASE_URL } from "../../key/";

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
  HEIGHT,
} from "../../components/Items/";

import { CITIES } from "../../components/Data/";
import LoaderModal from "../../components/LoaderModal";

const signUpDetailsScreen = (props) => {
  const [index, setIndex] = useState(0);
  const [city, setCity] = useState("Gainsville"); //
  const [name, setName] = useState("Juan Casas");
  const [email, setEmail] = useState("jcasasmail@gmail.com");
  const [phone, setPhone] = useState("5614525550");
  const [password1, setPassword1] = useState("U11234!");
  const [password2, setPassword2] = useState("U11234!");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [sentGeneratedCode, setSentGeneratedCode] = useState(null);
  const [userInputGeneratedCode, setUserInputGeneratedCode] = useState("");

  const [cityModalView, setCityModalView] = useState(false);

  // main function
  const next = () => {
    console.log("next()");
    if (ITEMS.length > index + 1) {
      setIndex(index + 1);
      flatListRef.scrollToIndex({ animated: true, index: index + 1 });
    }
  };
  // nextHelper() verifies the forms fields are not empty
  // aswell as stats password logic flow
  // returns true if all requirements of password are met
  const nextHelper = async () => {
    const indexOnScreen = index + 1;
    switch (indexOnScreen) {
      case 1:
        console.log("case 1");
        if (city === "Narnia") {
          console.log("case 1 fail");
          alert("Narnia does not exist, please select a real city");
          break;
        }
        console.log("case 1 pass");
        next();
        break;

      case 2:
        console.log("case 2");
        if (name === "") {
          console.log("case 2.1 fail");
          alert("Please enter your name");
          // alert("Please enter your email");
          break;
        } else {
          console.log("case 2 pass");
          next();
          break;
        }
      case 3:
        console.log("case 3");
        if (email === "") {
          console.log("case 3.1 fail");
          alert("Please enter your email");
          break;
        }
        if (!validateEmail(email)) {
          console.log("case 3.2 fail");
          alert("You have entered an invalid email address!");
          break;
        }
        if (phone === "") {
          console.log("case 3.3 fail");
          alert("Please enter your phone number");
          break;
        }
        // ;
        const check_Email_Password = await verifyEmailAndNumberForDuplicates(
          phone,
          email
        );
        // ;
        console.log("verifyEmailAndNumberForDuplicates() complete");

        if (!check_Email_Password) {
          console.log("case 3.4 fail");
          // alert(
          //   "The email or phone number you entered is not valid, please try again"
          // );
          return;
        }
        console.log("case 3 pass");
        next();
        break;

      case 4:
        console.log("case 5");
        if (sentGeneratedCode != userInputGeneratedCode) {
          console.log("case 5 fail");
          alert("The verification code is incorrect, please try again");
          break;
        }
        console.log("case 5 pass");
        next();
        break;
      case 5:
        console.log("case 5");
        console.log("case 5 pass");
        next();
        break;

      case 6:
        console.log("case 6");
        if (!passwordVerification(password1, password2)) {
          break;
        }
        const verification_data = await finalSubmit();

        if (!verification_data) {
          break;
        }
        ;
        props.doEmailLogin({ email, password: password2 });
        ;
        console.log("case 6 pass");

        break;
    }
  };

  const validateEmail = (email) => {
    //returns true if valid, false if not valid
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

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

  const finalSubmit = async () => {
    const splitName = name.split(" ");
    const fname = splitName[0];
    const lname = splitName[1] || " ";
    // console.log('lname:  ',lname)
    //
    console.log("userInputGeneratedCode:  ", userInputGeneratedCode);
    console.log("sentGeneratedCode:  ", sentGeneratedCode);
    try {
      const response = await axios.post(`${BASE_URL}/api/user/register`, {
        email: email,
        fname: fname,
        lname: lname,
        city: city,
        phone: phone,
        password: password2,
        referral: referralCode,
      });

      if (response.data.success) {
        console.log("signup complete!");
        return true;
      } else {
        console.log("ISSUE with final verification");
        // this.context.showAlert(response.data.message);
        return false;
      }
    } catch (error) {
      console.log("ERROR with final verification");
      console.log("ERROR:  ", error);
      return false;
    }

    //
  };

  const verifyEmailAndNumberForDuplicates = async (phone, email) => {
    ;
    console.log("verifyEmailAndNumberForDuplicates() initiated");
    console.log("email: ", email);
    console.log("phone: ", phone);

    try {
      const response = await axios.post(`${BASE_URL}/api/user/checkDuplicate`, {
        email: email,
        phone: phone,
      });

      if (response.data.success) {
        switch (response.data.message) {
          case 0:
            try {
              const response = await axios.post(
                `${BASE_URL}/api/twilio/verifyPhone`,
                {
                  to: phone,
                }
              );

              if (response.data.success) {
                console.log("email or phone have been checked ");
                console.log("code has been sent to the phone number provided");
                console.log("code to check:  ", response.data.message);
                setSentGeneratedCode(response.data.message);
                ;
                return true;
              } else {
                console.log(
                  "there has been an issue with the email and number provided"
                );
                console.log("response.data.message  :", response.data.message);
                ;
                alert(response.data.message);
                return false;
              }
            } catch (error) {
              console.log("There has been an error with the request");
              console.log("error:  ", error);
              ;
              alert("There has been an error with the request");
              return false;
            }

          case 1:
            console.log(
              " case 1:  Email address is already in use. Please try again."
            );
            ;
            alert("Email address is already in use. Please try again.");
            return false;

          case 2:
            console.log(
              "case 2:  Email address is already in use. Please try again."
            );
            ;
            alert("Phone number is already in use. Please try again.");
            return false;

          case 3:
            console.log(
              "case 3:  Email address and phone number are already in use. Please try again."
            );
            alert(
              "Email address and phone number are already in use. Please try again."
            );
            ;
            return false;
            break;
        }
      } else {
        console.log("there has been an error in the request");
        console.log(response.data.message);
        ;
        alert(response.data.message);
        return false;
      }
    } catch (error) {
      console.log("ERROR", error);
      ;
      alert("ERROR");
      return false;
    }
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
      value: "page 1: City",
    },

    {
      element: (
        <SignUpCard
          callBack={setName}
          title={"First & last name"}
          placeHolder="SkyWalker Chilly"
          textContentType="name"
          autoCompleteType="name"
        />
      ),
      value: "page 2: Name",
    },
    {
      element: (
        <>
          <SignUpCard
            callBack={setEmail}
            title={"Email"}
            placeHolder="dirty@laundry.com"
            textContentType="emailAddress"
            autoCompleteType="email"
            keyboardType="email-address"
          />
          <Text> </Text>
          <SignUpCard
            callBack={setPhone}
            title={"Phone Number:"}
            placeHolder="xxx-xxx-xxxx"
            textContentType="telephoneNumber"
            autoCompleteType="tel"
            keyboardType="number-pad"
          />
        </>
      ),
      value: "page 3: Email & phone verification",
    },
    {
      element: (
        <SignUpCard
          callBack={setUserInputGeneratedCode}
          title={"Verification code"}
          keyboardType="number-pad"
        />
      ),
      value: "page 4: Twilio verification",
    },
    {
      element: (
        <SignUpCard
          callBack={setReferralCode}
          title={"Referral Code"}
          placeHolder="Referral Code"
        />
      ),
      value: "page 5: Referral Code",
    },
    {
      element: (
        <Password setPassword1={setPassword1} setPassword2={setPassword2} />
      ),
      value: "page 6: ",
    },
  ];

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
  const passwordVerification = (password1, password2) => {
    if (password2 === "" && password1 === "") {
      alert("Please enter your password");
      return false;
    }
    if (password1 !== password2) {
      alert("Your passwords need to match!");
      return false;
    }
    console.log("passwords match");

    if (password1 === password2) {
      if (password2.length < 5) {
        alert("Your password needs to be at least 6 characters long");
        return false;
      }
      console.log("password is at least 6 chat long");
      if (!specialCharValidation(password2)) {
        alert("Your password needs to have at least 1 special character");
        return false;
      }
      console.log("password has at least 1 special character ");

      if (!checkForCapitals(password2)) {
        alert("Your password needs to have at least 1 capital letter ");
        return false;
      }
      console.log("password contains at least 1 capital letter");
      console.log("password logic complete, password passed all tests");
    }
    return true;
  };
  //password logic helper methods

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
    <>
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {!loading ? null : <LoaderModal loading={loading} />}

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
    </>
  );
};

const styles = StyleSheet.create({
  container: { position: "relative", zIndex: 0 },
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

// export default signUpDetailsScreen;
export default connect(null, actions)(signUpDetailsScreen);
