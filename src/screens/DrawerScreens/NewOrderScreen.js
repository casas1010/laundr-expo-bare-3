import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Button,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TimeModal from "../../components/TimeModal";
import {
  getUserLocation,
  getAddressFromLatLong,
  getLatLongFromAddress,
  getDistanceFromLatLon,
  checkIfUserIsInZone,
  verifyAddressIsInBounds,
} from "../../components/LocationHelperFunctions";
import {
  KeyboardAwareScrollView,
  ScrollableComponent,
} from "react-native-keyboard-aware-scroll-view";
import GlobalStyles from "../../components/GlobalStyles";
import {
  FIELD_NAME_TEXT,
  FIELD_VALUE_TEXT,
  FIELD_VALUE_FONT_SIZE,
  FIELD_NAME_FONT_SIZE,
  BUTTON,
  FIELD_VALUE_CONTAINER,
  WIDTH,
  HEIGHT,
  BUTTON_CONTAINER,
  BUTTON_TEXT,
  DIVIDER,
} from "../../components/Items/";
// import
import Header from "../../components/Header";
import Container from "../../components/Container";
import Map from "./Map";

const _DATE = new Date();
var DATE = _DATE.getDate();
var MONTH = _DATE.getMonth() + 1;
var HOUR = _DATE.getHours(); //To get the Current Hours
var MINUTE = _DATE.getMinutes();

const _WIDTH = WIDTH * 0.35;

const NewOrderScreen = (props) => {
  //
  // screen variables
  const [index, setIndex] = useState(0);

  //
  // card #1 variables
  const [pickUpDate, setPickUpDate] = useState({ month: MONTH, date: DATE });
  const [displayTime, setDisplayTime] = useState({
    hour: 12,
    minute: "00",
    m: "pm",
    allowed: true,
  });
  const [userModalView, setUserModalView] = useState(false);
  const [date, setDate] = useState(new Date("May 24, 1992 12:00:00")); // Random 0 reference point
  const [show, setShow] = useState(false);

  //
  // card #2 variables
  const [scent, setScent] = useState(false);
  const [delicate, setDelicate] = useState(false);
  const [separate, setSeparate] = useState(false);
  const [towelsSheets, setTowelsSheets] = useState(false);
  const [preferecenNote, setPreferenceNote] = useState();
  //
  // card #3 variables
  const [pickUpAddress, setPickUpAddress] = useState();

  //
  // card #4 variables
  const [loadNumber, setLoadNumber] = useState(1);
  const [price, setPrice] = useState({
    withOutSubscription: 12,
    withSubscription: 9.7,
  });

  //
  // screen functions
  useEffect(() => {
    setPickUpAddress(props.route.params.address); // here
  }, []);

  const nextHelper = async () => {
    console.log("nextHelper()");
    if (!displayTime.allowed) {
      alert("Please pick a time within working ours");
      return;
    }
    if (index == 2) {
      console.log("index == 2 , initiating addressPickUp Verification");
      console.log("pickUpAddress:   ", pickUpAddress);
      const location = await getLatLongFromAddress(pickUpAddress);
      console.log("location:: ", location);
      const addressVerificatioBoolean = await verifyAddressIsInBounds(location);
      if (!addressVerificatioBoolean) {
        console.log("user is out of range");
        alert(
          `Sorry!  You are currently out of Lanndr' active service area. Visit the site to request Landr at your location`
        );
        return;
      }
    }

    next();
  };
  const next = () => {
    console.log("next()");
    if (index === 5) {
      singUpAPI();
      return;
    }
    if (ITEMS.length > index + 1) {
      setIndex(index + 1);
      flatListRef.scrollToIndex({ animated: true, index: index + 1 });
    }
  };
  const previous = () => {
    console.log("previous()");
    if (index === 5) {
      singUpAPI();
      return;
    }
    if (0 <= index - 1) {
      setIndex(index - 1);
      flatListRef.scrollToIndex({ animated: true, index: index - 1 });
    }
  };
  const setHeaderText = (index) => {
    if (index == 0) return "Schedule Order";
    else if (index == 1) return "Set Preference";
    else if (index == 2) return "Confirm Location";
    else if (index == 3) return "Price Estimator";
    else return "Review";
    // (index == 4)
  };

  //
  // card #1 functions
  const setDay = (dateDetails) => {
    console.log("setDate()");
    console.log("date set for laundry:  ", dateDetails);
    console.log("pickUpDate.month        :", dateDetails.date);
    setPickUpDate(dateDetails);
  };
  const onTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    const str = JSON.stringify(currentDate);

    var time = {
      hour: str.slice(12, 14),
      minute: str.slice(15, 17),
      allowed: true,
    };

    console.log("hour before mod:  ", parseInt(time.hour));
    if (3 >= parseInt(time.hour) && parseInt(time.hour) >= 0) {
      // 8 => 10 pm
      console.log("case1");
      time.hour = parseInt(time.hour) + 8;
      time.allowed = false;
      time.m = "pm";
    } else if (4 == parseInt(time.hour)) {
      console.log("case2");
      time.hour = parseInt(time.hour) + 8;
      time.m = "am";
      time.allowed = false;
    } else if (15 >= parseInt(time.hour) && parseInt(time.hour) >= 4) {
      console.log("case3");
      console.log("subtract 4");
      time.m = "am";
      time.allowed = false;
      if (parseInt(time.hour) >= 14) {
        console.log("case3.1");
        time.allowed = true;
      }
      time.hour = parseInt(time.hour) - 4;
    } else if (parseInt(time.hour) == 16) {
      console.log("case4");
      console.log("edge case, setting to 12 pm");
      time.m = "pm";
      time.hour = 12;
    } else if (parseInt(time.hour) > 16) {
      console.log("case5");
      console.log("subtract 16");
      time.m = "pm";
      time.hour = parseInt(time.hour) - 16;
      time.allowed = true;
      if (parseInt(time.hour) >= 24) {
        console.log("case5.1");
        time.allowed = false;
      }
    }
    setDisplayTime(time);

    //
    //
    //
    //
    //
    //
    // let dayDifference = pickUpDate.date - DATE;
    // if (dayDifference == 1) {
    //   console.log("day for pickup is not today");
    //   setDisplayTime(time);
    //   return;
    // }

    // // If user wants clothes picked up today, verify that there is at least one hour
    // // between the time they want their laundry picked up and the current time
    // let HOUR_COPY = HOUR;
    // let MINUTE_COPY = MINUTE;
    // let hourDifference;
    // if (HOUR_COPY > 12) {
    //   HOUR_COPY = HOUR_COPY - 12;
    // }
    // hourDifference = HOUR_COPY - time.hour;
    // console.log("hourDifference: ", hourDifference);
    // if (hourDifference < 0) {
    //   time.allowed = false;
    //   setDisplayTime(time);
    //   return;
    // }

    // console.log("LIVE DATE:  ", DATE);
    // console.log("date picked:  ", pickUpDate.date);
    // console.log("LIVE HOUR:  ", HOUR_COPY);
    // console.log("hour picked: ", time.hour);
    // console.log("hours difference:  ", time.hour - HOUR_COPY);

    // console.log(60 - MINUTE);
    // console.log("hour after mod:   ", parseInt(time.hour));
    // setDisplayTime(time);
  };
  const setUserHelper = (item) => {
    // setUserType(item);
    showModalUser();
  };
  const showModalUser = () => {
    console.log("showModalUser()");
    setUserModalView(!userModalView);
  };

  //
  // card #2 functions
  const setScentImage = () => {
    return scent ? (
      <Image
        style={styles.imageDetails}
        source={require("../../assets/Scented.png")}
      />
    ) : (
      <Image
        style={styles.imageDetails}
        source={require("../../assets/Scentedg.png")}
      />
    );
  };
  const setDelicateImage = () => {
    return delicate ? (
      <Image
        style={styles.imageDetails}
        source={require("../../assets/Delicates.png")}
      />
    ) : (
      <Image
        style={styles.imageDetails}
        source={require("../../assets/Delicatesg.png")}
      />
    );
  };
  const setSeparateImage = () => {
    return separate ? (
      <Image
        style={styles.imageDetails}
        source={require("../../assets/Separate.png")}
      />
    ) : (
      <Image
        style={styles.imageDetails}
        source={require("../../assets/Separateg.png")}
      />
    );
  };
  const setTowelsSheetsImage = () => {
    return towelsSheets ? (
      <Image
        style={styles.imageDetails}
        source={require("../../assets/Towels.png")}
      />
    ) : (
      <Image
        style={styles.imageDetails}
        source={require("../../assets/Towelsg.png")}
      />
    );
  };
  //
  // card #3 functions
  const addressHelper = async (adr) => {
    console.log("addressHelper()  initiated for", adr);
    if (adr == undefined || adr == "") {
      console.log("address passed does is blank or undefined");
      return;
    }
    const addressLatLong = await getLatLongFromAddress(adr);
    console.log("addressLatLong:  ", addressLatLong);
    const addressDistanceToHeadQuarters = getDistanceFromLatLon(
      addressLatLong.latitude,
      addressLatLong.longitude
    );
    console.log(
      "addressDistanceToHeadQuarters:  ",
      addressDistanceToHeadQuarters
    );
    setPickUpAddress(adr);
  };
  //
  // card #4 functions
  const setLoadImage = () => {
    if (loadNumber == 1) {
      return (
        <Image
          style={styles.imageDetails}
          source={require("../../assets/1_load_icon.png")}
        />
      );
    } else if (loadNumber == 1.5) {
      return (
        <Image
          style={styles.imageDetails}
          source={require("../../assets/1.5_load_icon.png")}
        />
      );
    } else if (loadNumber == 2) {
      return (
        <Image
          style={styles.imageDetails}
          source={require("../../assets/2_load_icon.png")}
        />
      );
    } else if (loadNumber == 2.5) {
      return (
        <Image
          style={styles.imageDetails}
          source={require("../../assets/2.5_load_icon.png")}
        />
      );
    } else if (loadNumber == 3) {
      return (
        <Image
          style={styles.imageDetails}
          source={require("../../assets/3_load_icon.png")}
        />
      );
    }
  };
  const changeLoadNumber = (sign) => {
    console.log("changeLoadNumber() initiated");
    console.log("sign: ", sign);
    console.log("loadNumber: ", loadNumber);
    console.log('sign == "+"   ', sign == "+");
    console.log('sign == "-"   ', sign == "-");

    if (sign == "+") {
      if (loadNumber == 3) {
        return;
      }
      setLoadNumber(loadNumber + 0.5);
      return;
    }
    if (loadNumber == 1) {
      return;
    }
    setLoadNumber(loadNumber - 0.5);
    return;
  };
  useEffect(() => {
    setPriceBasedOnLoadNumber(loadNumber);
  }, [loadNumber]);
  const setPriceBasedOnLoadNumber = (loadNumber) => {
    if (loadNumber == 1) {
      setPrice({
        withOutSubscription: (12.0).toFixed(2),
        withSubscription: (9.7).toFixed(2),
      });
    } else if (loadNumber == 1.5) {
      setPrice({
        withOutSubscription: (18.0).toFixed(2),
        withSubscription: 14.55,
      });
    } else if (loadNumber == 2) {
      setPrice({
        withOutSubscription: (24.0).toFixed(2),
        withSubscription: 19.39,
      });
    } else if (loadNumber == 2.5) {
      setPrice({
        withOutSubscription: (30.0).toFixed(2),
        withSubscription: 24.24,
      });
    } else if (loadNumber == 3) {
      setPrice({
        withOutSubscription: (36.0).toFixed(2),
        withSubscription: 29.09,
      });
    }
  };

  const ITEMS = [
    {
      element: (
        <>
          <Text style={[FIELD_NAME_TEXT]}>
            What day would you like your laundry picked up?
          </Text>
          <View style={styles.container_dates}>
            <TouchableOpacity
              style={[
                styles.container_date,
                {
                  backgroundColor:
                    pickUpDate.date == DATE ? "#01c9e2" : "#f8f9fa",
                },
              ]}
              onPress={() => setDay({ month: MONTH, date: DATE })}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: pickUpDate.date == DATE ? "white" : "black",
                }}
              >
                Today:
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: pickUpDate.date == DATE ? "white" : "black",
                }}
              >
                {MONTH}/{DATE}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDay({ month: MONTH, date: DATE + 1 })}
              style={[
                styles.container_date,
                {
                  backgroundColor:
                    pickUpDate.date == DATE + 1 ? "#01c9e2" : "#f8f9fa",
                },
              ]}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: pickUpDate.date == DATE + 1 ? "white" : "black",
                }}
              >
                Tomorrow:
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: pickUpDate.date == DATE + 1 ? "white" : "black",
                }}
              >
                {MONTH}/{DATE + 1}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={[FIELD_NAME_TEXT]}>
              What time would you like your laundry to be picked up?
            </Text>

            <TouchableOpacity
              style={styles.container_time}
              onPress={() => setUserModalView(!userModalView)}
            >
              <View style={[styles.container_date, { width: "80%" }]}>
                <Text
                  style={[
                    FIELD_NAME_TEXT,
                    { color: displayTime.allowed ? "white" : "red" },
                  ]}
                >
                  {displayTime.hour} : {displayTime.minute} {displayTime.m}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <TimeModal
            title="Select User Type"
            setCardTypeHelper={setUserHelper}
            showModal={showModalUser}
            modalView={userModalView}
          >
            <Text style={[FIELD_NAME_TEXT]}>
              What time would you like your laundry to be picked up?
            </Text>

            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={"time"}
              is24Hour={false}
              display="default"
              onChange={onTimeChange}
            />
            <Text
              style={{
                color: displayTime.allowed ? "black" : "red",
              }}
            >
              Monday through Friday from 10 am to 7 pm
            </Text>
          </TimeModal>
          <Text style={{}}>Monday through Friday from 10 am to 7 pm</Text>
        </>
      ),
      id: "card #1",
    },
    {
      element: (
        <>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
              onPress={() => {
                console.log(`scent: `, !scent);
                setScent(!scent);
              }}
              style={styles.container_picture_bodyText}
            >
              {setScentImage()}
              <Text
                style={[styles.title, { color: scent ? "#01c9e2" : "black" }]}
              >
                Scented
              </Text>
              <Text style={styles.description}>
                Unscented detergent is hypoallergenic.
              </Text>
            </TouchableOpacity>
            {/*  */}
            <TouchableOpacity
              onPress={() => {
                console.log(`delicate: `, !delicate);
                setDelicate(!delicate);
              }}
              style={styles.container_picture_bodyText}
            >
              {setDelicateImage()}
              <Text
                style={[
                  styles.title,
                  { color: delicate ? "#01c9e2" : "black" },
                ]}
              >
                Delicates
              </Text>
              <Text style={styles.description}>
                Delicate clothing is washed in a mesh bag and dried on low heat
              </Text>
            </TouchableOpacity>
            {/*  */}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
              onPress={() => {
                console.log(`separate: `, !separate);
                setSeparate(!separate);
              }}
              style={styles.container_picture_bodyText}
            >
              {setSeparateImage()}
              <Text
                style={[
                  styles.title,
                  { color: separate ? "#01c9e2" : "black" },
                ]}
              >
                Separate
              </Text>
              <Text style={styles.description}>Separate whites and colors</Text>
            </TouchableOpacity>
            {/*  */}
            <TouchableOpacity
              onPress={() => {
                console.log(`towelsSheets: `, !towelsSheets);
                setTowelsSheets(!towelsSheets);
              }}
              style={styles.container_picture_bodyText}
            >
              {setTowelsSheetsImage()}
              <Text
                style={[
                  styles.title,
                  { color: towelsSheets ? "#01c9e2" : "black" },
                ]}
              >
                Towels and Sheets
              </Text>
              <Text style={styles.description}>
                Towels and sheets are washed separately and dried on high heat
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            value={preferecenNote}
            onChangeText={(txt) => setPreferenceNote(txt)}
            maxLength={500}
            multiline={true}
            placeholder="Special Instructions"
            style={[
              FIELD_VALUE_CONTAINER,
              { width: "100%", height: HEIGHT * 0.06, marginBottom: 30 },
            ]}
          />
        </>
      ),
      id: "card #2",
    },
    {
      element: <Map props={props.route.params} addressHelper={addressHelper} />,
      id: "card #3",
    },
    {
      element: (
        <View style={{ alignItems: "center" }}>
          <>
            <BUTTON text={"$" + price.withOutSubscription} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
              }}
            >
              <View
                style={[
                  {
                    height: 1,
                    width: "30%",
                    backgroundColor: "grey",
                  },
                  { ...props.style },
                ]}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontSize: FIELD_VALUE_FONT_SIZE,
                  fontWeight: "bold",
                }}
              >
                {" "}
                or{" "}
              </Text>
              <View
                style={[
                  {
                    height: 1,
                    width: "30%",
                    backgroundColor: "grey",
                  },
                  { ...props.style },
                ]}
              />
            </View>

            <BUTTON
              style={{ marginBottom: 1, marginTop: 0 }}
              text={"$" + price.withSubscription}
            />
            <Text>with a subscription</Text>
          </>

          {setLoadImage()}
          <Text>Amount of loads to wash: {loadNumber}</Text>

          <View style={{ flexDirection: "row" }}>
            <BUTTON
              style={{ width: "40%" }}
              text="-"
              onPress={() => changeLoadNumber("-")}
            />
            <BUTTON
              style={{ width: "40%" }}
              text="+"
              onPress={() => changeLoadNumber("+")}
            />
          </View>
        </View>
      ),
      id: "card #4",
    },
    {
      element: (
        <ScrollView showsHorizontalScrollIndicator={false}>
          <Text style={{ textAlign: "center", ...FIELD_VALUE_TEXT }}>
            Please verify the information below
          </Text>
          <DIVIDER
            style={{ margin: 15, backgroundColor: "black", width: "50%" }}
          />

          <View style={styles.fieldContainer}>
            <View style={styles.fieldNameContainer}>
              <Text style={styles.fieldNameTxT}>Address:</Text>
            </View>
            <View
              style={[
                styles.fieldValueContainer,
                { flexDirection: "column", alignItems: "flex-end", backgroundColor:'red' },
              ]}
            >
              <Text style={styles.fieldValueTxT}>{pickUpAddress}</Text>
            </View>
          </View>
          {/*  */}
          <DIVIDER />
          {/*  */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldNameContainer}>
              <Text style={styles.fieldNameTxT}>Pickup Date:</Text>
            </View>
            <View style={styles.fieldValueContainer}>
              <Text style={styles.fieldValueTxT}>
                {pickUpDate.month}/{pickUpDate.date}
              </Text>
            </View>
          </View>
          {/*  */}
          <DIVIDER />
          {/*  */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldNameContainer}>
              <Text style={styles.fieldNameTxT}>Pickup Time:</Text>
            </View>
            <View style={styles.fieldValueContainer}>
              <Text style={styles.fieldValueTxT}>
                {displayTime.hour}:{displayTime.minute} {displayTime.m}
              </Text>
            </View>
          </View>
          {/*  */}
          <DIVIDER />
          {/*  */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldNameContainer}>
              <Text style={styles.fieldNameTxT}>Pickup Date:</Text>
            </View>
            <View style={styles.fieldValueContainer}>
              <Text style={styles.fieldValueTxT}>
                {pickUpDate.month}/{pickUpDate.date}
              </Text>
            </View>
          </View>
          {/*  */}
          <DIVIDER />
          {/*  */}
          <View style={styles.fieldContainer}>
            <View
              style={[styles.fieldNameContainer, { justifyContent: "center" }]}
            >
              <Text style={styles.fieldNameTxT}>Preferences:</Text>
            </View>
            <View
              style={[
                styles.fieldValueContainer,
                { flexDirection: "column", alignItems: "flex-end" },
              ]}
            >
              <Text style={styles.fieldValueTxT}>
                {scent ? "Scented" : null}
              </Text>
              <Text style={styles.fieldValueTxT}>
                {delicate ? "Delicates" : null}
              </Text>
              <Text style={styles.fieldValueTxT}>
                {separate ? "Separate" : null}
              </Text>
              <Text style={styles.fieldValueTxT}>
                {towelsSheets ? "Towels/Sheets" : null}
              </Text>
            </View>
          </View>
          {/*  */}
          {/*  */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldNameContainer}>
              <Text style={styles.fieldNameTxT}>Preferences Note:</Text>
            </View>
            <View style={styles.fieldValueContainer}>
              <Text style={styles.fieldValueTxT}>
                {preferecenNote ? preferecenNote : "No preference note"}
              </Text>
            </View>
          </View>
          {/*  */}
          <DIVIDER />
          {/*  */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldNameContainer}>
              <Text style={styles.fieldNameTxT}>Estimated Total:</Text>
            </View>
            <View style={styles.fieldValueContainer}>
              <Text style={styles.fieldValueTxT}>
                ${price.withOutSubscription}
              </Text>
            </View>
          </View>
        </ScrollView>
      ),
      id: "card #5",
    },
  ];

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Header
        openDrawer={props.navigation.openDrawer}
        name={setHeaderText(index)}
      />
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
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            return (
              <Container style={{ height: HEIGHT * 0.73 }}>
                {item.element}
              </Container>
            );
            // if (item.id == "card #3")
            //   return (
            //     <Map props={props.route.params} addressHelper={addressHelper} />
            //   );
            // else
            //   return (
            //     <Container style={{ height: HEIGHT * 0.73 }}>
            //       {item.element}
            //     </Container>
            //   );
          }}
        />
        <View style={styles.container_buttons}>
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
  container_dates: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  container_date: {
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    backgroundColor: "#01c9e2",
    height: 80,
    margin: 8,
    borderRadius: 15,
  },
  container_time: {
    alignItems: "center",
  },
  container_buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  container_picture_bodyText: {
    width: "50%",
    marginLeft: 5,
    marginRight: 5,
    // backgroundColor: "red",
    // justifyContent: "center",
    alignItems: "center",
  },
  imageDetails: {
    height: _WIDTH,
    width: _WIDTH,
    // backgroundColor: "green",
    borderRadius: 25,
  },
  title: {
    fontWeight: "bold",
    paddingTop: 5,
    textAlign: "center",
  },
  description: {
    fontSize: WIDTH * 0.04,
    // width: "100%",
    // fontWeight: "bold",
  },
  fieldContainer: {
    flexDirection: "row",
    marginBottom: 5,
    marginTop: 5,
  },
  fieldNameContainer: {
    width: "40%",
    // backgroundColor:'red',
  },
  fieldNameTxT: {
    fontSize: FIELD_VALUE_FONT_SIZE,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  fieldValueContainer: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  fieldValueTxT: {
    fontSize: FIELD_VALUE_FONT_SIZE,
    fontWeight: "bold",
    paddingRight: 10,
  },
});
export default NewOrderScreen;
