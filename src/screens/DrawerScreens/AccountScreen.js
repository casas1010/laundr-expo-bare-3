import { connect } from "react-redux";
import * as actions from "../../actions";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/FontAwesome";
import { EvilIcons } from "@expo/vector-icons";

import GlobalStyles from "../../components/GlobalStyles";
import Header from "../../components/Header";
import MenuModal from "../../components/MenuModal";
import Container from "../../components/Container";
import LoaderModal from "../../components/LoaderModal";
import {
  HEIGHT,
  BUTTON,
  FIELD_NAME_TEXT,
  FIELD_VALUE_TEXT,
  FIELD_VALUE_CONTAINER,
} from "../../components/Items/";
import { CITIES } from "../../components/Data/";

const AccountScreen = (props) => {
  const [loading, setLoading] = useState(true);

  // user variables
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [city, setCity] = useState();
  const [phone, setPhone] = useState();
  const [subscription, setSubscription] = useState();

  // lock variables
  const [editable, setEditable] = useState(true);
  const [lock, setLock] = useState(true);
  const [inputColor, setInputColor] = useState("");
  const [lockColor, setLockColor] = useState("");

  // modal variables
  const [cityModalView, setCityModalView] = useState(false);

  useEffect(() => {
    console.log("AccountScreen useEffect ");
    setUserValues();
    setLoading(false);
  });

  useEffect(() => {
    setEditable(!editable);
    lock ? setInputColor("#c9c9c5") : setInputColor("white");
    lock ? setLockColor("#990000") : setLockColor("black");
  }, [lock]);

  const setUserValues = () => {
    const userData = props.user;
    setEmail(userData.email);
    setName(userData.fname + " " + userData.lname);
    setCity(userData.city);
    setPhone(userData.phone);
    setPassword(userData.password);
    // setSubscription(userData.subscription.plan);
  };

  //  MODAL VARIABLES
  const setCityHelper = (item) => {
    setCity(item);
    showModalCity();
  };
  const showModalCity = () => {
    console.log("showModalCity()");
    setCityModalView(!cityModalView);
  };
  const modalButtonHelper = () => {
    if (editable) {
      showModalCity();
    }
  };
  //

  return loading ? (
    <LoaderModal />
  ) : (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Header
        openDrawer={() => props.navigation.navigate("Home")}
        name="Account"
      />

      {/* SCREEN LOCK  */}
      <TouchableOpacity
        style={[styles.lockButton, { backgroundColor: lockColor }]}
        onPress={() => setLock(!lock)}
      >
        {lock ? (
          <>
            <EvilIcons name="pencil" size={HEIGHT * 0.05} color="black" />
            <Text style={{ fontSize: HEIGHT * 0.03 }}>Edit</Text>
          </>
        ) : (
          <Icon name="lock" color={"white"} size={HEIGHT * 0.05} />
        )}
      </TouchableOpacity>
      {/* SCREEN LOCK  */}

      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
      >
        <ScrollView>
          <View style={{ position: "absolute", zIndex: 0 }}>
            <Container>
              {/*  */}
              {/*  */}
              <View style={styles.container_Tittle_Input}>
                <Text style={[FIELD_NAME_TEXT]}>Name</Text>
                <View
                  style={[
                    FIELD_VALUE_CONTAINER,
                    { alignItems: "flex-start", backgroundColor: inputColor },
                  ]}
                >
                  <TextInput
                    editable={editable}
                    value={name}
                    onChangeText={(txt) => setName(txt)}
                    placeholder=" Name"
                    style={FIELD_VALUE_TEXT}
                  />
                </View>
              </View>
              {/*  */}
              {/*  */}
              <View style={styles.container_Tittle_Input}>
                <Text style={[FIELD_NAME_TEXT]}>Email</Text>
                <View
                  style={[
                    FIELD_VALUE_CONTAINER,
                    { alignItems: "flex-start", backgroundColor: inputColor },
                  ]}
                >
                  <TextInput
                    editable={editable}
                    value={email}
                    onChangeText={(txt) => setEmail(txt)}
                    placeholder=" Email"
                    style={FIELD_VALUE_TEXT}
                  />
                </View>
              </View>
              {/*  */}
              {/*  */}
              <View style={styles.container_Tittle_Input}>
                <Text style={[FIELD_NAME_TEXT]}>Password</Text>
                <View
                  style={[
                    FIELD_VALUE_CONTAINER,
                    { alignItems: "flex-start", backgroundColor: inputColor },
                  ]}
                >
                  <TextInput
                    editable={editable}
                    value={password}
                    onChangeText={(txt) => setPassword(txt)}
                    placeholder=" Email"
                    style={FIELD_VALUE_TEXT}
                  />
                </View>
              </View>
              {/*  */}
              {/*  */}
              <View style={styles.container_Tittle_Input}>
                <Text style={[FIELD_NAME_TEXT]}>Phone</Text>
                <View
                  style={[
                    FIELD_VALUE_CONTAINER,
                    { alignItems: "flex-start", backgroundColor: inputColor },
                  ]}
                >
                  <TextInput
                    editable={editable}
                    value={phone}
                    keyboardType="number-pad"
                    onChangeText={(txt) => setPhone(txt)}
                    placeholder=" Phone"
                    style={FIELD_VALUE_TEXT}
                  />
                </View>
              </View>
              {/*  */}
              {/*  */}
              <View style={styles.container_Tittle_Input}>
                <TouchableOpacity onPress={modalButtonHelper}>
                  <Text style={[FIELD_NAME_TEXT]}>City</Text>
                  <View
                    style={[
                      FIELD_VALUE_CONTAINER,
                      { alignItems: "flex-start", backgroundColor: inputColor },
                    ]}
                  >
                    <Text style={FIELD_VALUE_TEXT}>{city}</Text>
                  </View>
                </TouchableOpacity>
                <MenuModal
                  setCardTypeHelper={setCityHelper}
                  showModal={showModalCity}
                  modalView={cityModalView}
                  data={CITIES}
                  title="Select Your City"
                />
              </View>
              {/*  
           
            <View style={styles.container_Tittle_Input}>
              <TouchableOpacity
                onPress={console.log("subscrition screen details?")}
              >
                <Text style={[FIELD_NAME_TEXT]}>Subscription</Text>
                <View
                  style={[
                    FIELD_VALUE_CONTAINER,
                    { alignItems: "flex-start", backgroundColor: inputColor },
                  ]}
                >
                  <Text style={FIELD_VALUE_TEXT}>{subscription}</Text>
                </View>
              </TouchableOpacity>
            </View>
      
             */}
            </Container>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <BUTTON
                text="LOG OUT"
                onPress={() => {
                  console.log("log out pressed");
                  props.emailLogOut(props.navigation);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lockButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    top: HEIGHT * 0.1,
    zIndex: 1,
    height: 80,
    width: 80,
    borderRadius: 80,
    backgroundColor: "black",
  },
  container_Tittle_Input: {
    marginTop: 10,
    marginBottom: 10,
  },
});

function mapStateToProps({ auth, user }) {
  return { auth, user };
}

export default connect(mapStateToProps, actions)(AccountScreen);
