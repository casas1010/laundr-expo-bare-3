import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Button,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TimeModal from "../../components/TimeModal";
import MapView, { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";
import SearchBar from "../../components/SearchBar";
import { GOOGLE_MAPS_KEY, BASE_URL } from "../../key/";
import axios from "axios";

import {
  getLatLongFromAddress,
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
  SHADOW,
  DIVIDER,
  FadeInView,
} from "../../components/Items/";

import Header from "../../components/Header";
import Container from "../../components/Container";

import moment from "moment";

const TODAYS_DATE = new Date();
var DAY_NUMBER = TODAYS_DATE.getDay();

var DATE = TODAYS_DATE.getDate();
var MONTH = TODAYS_DATE.getMonth() + 1;
var HOUR = TODAYS_DATE.getHours(); //To get the Current Hours
var MINUTE = TODAYS_DATE.getMinutes();

const LBS_PER_LOAD = 8;
const _WIDTH = WIDTH * 0.35;
const FAMILY_PLAN_MULTIPLIER = 1.2; // $/lbs*load
const NOT_FAMILY_PLAN_MULTIPLIER = 1.5; // $/lbs*load
const NO_PLAN_MULTIPLIER = 1.5; // $/lbs*load
let AC_TIMEOUT;
const NewOrderScreen = (props) => {
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

  //
  // card #2 variables
  const [scent, setScent] = useState(false);
  const [delicate, setDelicate] = useState(false);
  const [separate, setSeparate] = useState(false);
  const [towelsSheets, setTowelsSheets] = useState(false);
  const [preferecenNote, setPreferenceNote] = useState("");

  //
  // card #3 variables
  const [pickUpAddressFromDropDown, setPickUpAddressFromDropDown] = useState(
    "placeHolder"
  );
  const [pickUpAddress, setPickUpAddress] = useState();
  const [addressNote, setAddressNote] = useState("");
  const [initialRegion, setInitialRegion] = useState(undefined);
  const [newRegion, setNewRegion] = useState();
  const [loading, setLoading] = useState(true);
  const [
    autoCompletePossibleLocations,
    setAutoCompletePossibleLocations,
  ] = useState({ display: true, array: [] });
  //
  // card #4 variables

  const [lbsForJob, setLbsForJob] = useState(8);
  const [loadForJob, setLoadForJob] = useState(1);
  const [lbsLeft, setLbsLeft] = useState();
  const [coupon, setCoupon] = useState(0);
  const [equation, setEquation] = useState();
  const [subscriptionType, setSubscriptionType] = useState();
  const [finalCost, setFinalCost] = useState();
  const [totalCost, setTotalCost] = useState();

  const [price, setPrice] = useState({
    withOutSubscription: 12,
    withSubscription: 9.7,
  });

  // useEffect(() => {
  //   // setLbsLeft(props.subscription.lbsLeft);
  //   console.log("CHANGE THIS");
  //   console.log("CHANGE THIS");
  //   console.log("CHANGE THIS");
  //   setLbsLeft(20);
  // }, []);

  //
  // card #5

  //
  // screen functions
  const nextHelper = async () => {
    const indexOnScreen = index + 1;
    switch (indexOnScreen) {
      case 1:
        if (!displayTime.allowed) {
          alert("Please pick a time within working ours");
          return;
        }
        next();
        break;
      case 3:
        if (
          pickUpAddress === "" ||
          pickUpAddressFromDropDown !== pickUpAddress
        ) {
          alert(
            "Please enter an address, then pick a suggested address from the dropdown"
          );
          break;
        }
        const location = await getLatLongFromAddress(pickUpAddress);

        const addressVerificatioBoolean = await verifyAddressIsInBounds(
          location
        );
        if (!addressVerificatioBoolean) {
          console.log("user is out of range");
          alert(
            `Sorry!  You are currently out of Laundr' active service area. Visit the site to request Landr at your location`
          );
          return;
        }
        next();
        break;
      case 4:
        next();
        break;
      case 5:
        if (props.payment.brand === "") {
          props.navigation.navigate("Payment");
          return;
        }
        makePayment();
        break;

      default:
        console.log("switch default case initiated");
        console.log("case: ", indexOnScreen);
        next();
    }
  };

  const next = () => {
    console.log("next()");
    console.log("ITEMS.length:  ", ITEMS.length);
    console.log("index + 1:  ", index + 1);
    if (ITEMS.length > index + 1) {
      setIndex(index + 1);
      flatListRef.scrollToIndex({ animated: true, index: index + 1 });
    }
  };

  const previous = () => {
    console.log("previous()");
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
  useEffect(() => {
    onTimeChange();
  }, [pickUpDate]);
  const setDay = (dateDetails) => {
    console.log("setDate()");
    console.log("date set for laundry:  ", dateDetails);
    setPickUpDate(dateDetails);
  };

  const getDayValueFromNumber = (DAY_NUMBER) => {
    switch (DAY_NUMBER) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      case 7:
        return "Sunday";
    }
  };

  const onTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    const str = JSON.stringify(currentDate);

    var time = {
      hour: str.slice(12, 14),
      minute: str.slice(15, 17),
      allowed: true,
    };

    // the following code {} only changes the time format
    {
      console.log("hour before modification:  ", parseInt(time.hour));
      if (3 >= parseInt(time.hour) && parseInt(time.hour) >= 0) {
        // 8 => 10 pm
        console.log("hour modification case1");
        time.hour = parseInt(time.hour) + 8;
        time.allowed = false;
        time.m = "pm";
      } else if (4 == parseInt(time.hour)) {
        console.log("hour modification case2");
        time.hour = parseInt(time.hour) + 8;
        time.m = "am";
        time.allowed = false;
      } else if (15 >= parseInt(time.hour) && parseInt(time.hour) >= 4) {
        console.log("hour modification case3");
        time.m = "am";
        time.allowed = false;
        if (parseInt(time.hour) >= 14) {
          console.log("hour modification case3.1");
          time.allowed = true;
        }
        time.hour = parseInt(time.hour) - 4;
      } else if (parseInt(time.hour) == 16) {
        //edge case, setting to 12 pm
        console.log("hour modification case4");
        time.m = "pm";
        time.hour = 12;
      } else if (parseInt(time.hour) > 16) {
        console.log("hour modification case5");
        time.m = "pm";
        time.hour = parseInt(time.hour) - 16;
        time.allowed = true;
        if (parseInt(time.hour) >= 24) {
          console.log(" hour modification case5.1");
          time.allowed = false;
        }
      }
      console.log("hour after modification:  ", parseInt(time.hour));
    }

    setDisplayTime(time);
    let dayDifference = pickUpDate.date - DATE;
    console.log("dayDifference::", dayDifference);
    if (dayDifference == 1) {
      setDisplayTime(time);
      return;
    }
    // if the code has made it this far, it means that the user wants their laundry
    // cleaned today.
    // the code below changes the format to 24 hours, then takes the difference in minutes
    {
      const current24Time = moment().format("HH:mm:ss");
      const current24TimeHour = current24Time.slice(0, 2);
      const currentMinute = current24Time.slice(3, 5);

      let displayHourin24 = time.hour;
      if (time.m == "pm" && displayHourin24 < 12) {
        displayHourin24 = parseInt(displayHourin24) + 12;
      }
      console.log("displayHourin24:  ", displayHourin24);
      const displayTotalMinute =
        parseInt(displayHourin24) * 60 + parseInt(time.minute);
      console.log("displayTotalMinute:  ", displayTotalMinute);
      const currentTotalMinute =
        parseInt(current24TimeHour) * 60 + parseInt(currentMinute);
      console.log("currentTotalMinute:  ", currentTotalMinute);
      const minuteDifference = displayTotalMinute - currentTotalMinute;
      console.log("MINUTE DIFFERENCE:  ", minuteDifference);
      if (minuteDifference < 60) {
        console.log("minute differnece is less than 60");
        time.allowed = false;
        setDisplayTime(time);
        return;
      }
    }
  };

  const setUserHelper = (item) => {
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
  useEffect(() => {
    setPickUpAddress(props.route.params.address);
    setPickUpAddressFromDropDown(props.route.params.address);
  }, []);

  // functions that run the first time page loads
  //
  useEffect(() => {
    console.log("useEffect() newOrderScreen []");
    // console.log('props.route.params.location:   ',props.route.params.location)
    setNewRegionHelper(props.route.params.address);
  }, []);

  function goToInitialLocation() {
    console.log("goToInitialLocation() initiated3");
    let initialRegion = props.route.params.location;
    initialRegion["latitudeDelta"] = 0.005; // sets zoom level
    initialRegion["longitudeDelta"] = 0.005; // sets zoom level
    console.log("initialRegion2:   ", initialRegion);
    this.mapView.animateToRegion(initialRegion, 2000);
    console.log("goToInitialLocation() complete");
  }

  useEffect(() => {
    console.log("HomeScreen useEffect() [address]");
    clearTimeout(AC_TIMEOUT);
    AC_TIMEOUT = setTimeout(function () {
      console.log("inside useEffect!");
      addresAutoComplete();
    }, 1200);
  }, [pickUpAddress]);

  const addresAutoComplete = async () => {
    console.log(
      `addresAutoComplete() initiated for pickUpAddress:  ${pickUpAddress} `
    );
    if (pickUpAddress == "") {
      console.log("pickUpAddress is empty");
      console.log("exiting addresAutoComplete() without API call");
      setAutoCompletePossibleLocations({ display: false, array: [] });
      return;
    }
    if (pickUpAddress == undefined) {
      console.log(`pickUpAddress is undefined`);
      console.log("exiting addresAutoComplete() without API call");
      setAutoCompletePossibleLocations({ display: false, array: [] });
      return;
    }

    console.log("initiating API call for pickUpAddress:  ", pickUpAddress);
    let possibleLocations = [];
    let sanitizedAddress = pickUpAddress.replace(/ /g, "+");
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${sanitizedAddress}&components=country:us&key=${GOOGLE_MAPS_KEY}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data["predictions"].length; i++) {
          possibleLocations.push(data["predictions"][i]["description"]);
        }
      })
      .catch((err) => {
        console.warn(err.message);
      });
    console.log("auto complete for input pickUpAddress & API complete");
    console.log(`possibleLocations size:  `, possibleLocations.length);
    console.log("updating the state variable autoCompletePossibleLocations");
    let obj = {
      ...autoCompletePossibleLocations,
      array: [...possibleLocations],
    };
    setAutoCompletePossibleLocations(obj);
    // setAutoCompletePossibleLocations({...autoCompletePossibleLocations,array:[...possibleLocations]});
  };

  const setNewRegionHelper = async (adr) => {
    console.log("setNewRegion() initiated");
    let latLongFromAddress = await getLatLongFromAddress(adr);
    console.log("latLongFromAddress:  ", latLongFromAddress);
    let _newRegion = {
      ...latLongFromAddress,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    };
    console.log("newRegion:   ", _newRegion);
    // setInitialRegion(newRegion);
    setNewRegion(_newRegion);
  };

  const displayAutoCompletePossibleLocations = () => {
    console.log("displayAutoCompletePossibleLocations()");
    console.log(
      "display possible locations under search bar?  ",
      autoCompletePossibleLocations.display
    );
    console.log("array size: ", autoCompletePossibleLocations.array.length);
    return autoCompletePossibleLocations.display ? (
      <FlatList
        data={autoCompletePossibleLocations.array}
        keyExtractor={(item) => item}
        // extraData={address}
        style={{
          height: 180,
          borderColor: "green",
        }}
        renderItem={({ item }) => {
          console.log("printing item");
          return (
            <TouchableOpacity
              onPress={() => {
                console.log(`item pressed:   ${item}`);
                setPickUpAddressFromDropDown(item);
                setPickUpAddress(item);
                setAutoCompletePossibleLocations({ display: false, array: [] });
                setNewRegionHelper(item);
              }}
            >
              <Container style={{ margin: 5, backgroundColor: "#f8f9fa" }}>
                <Text>{item}</Text>
              </Container>
            </TouchableOpacity>
          );
        }}
      />
    ) : null;
  };

  const searchBarOnFocus = () => {
    console.log("onFocus has fired");
    setAutoCompletePossibleLocations({
      ...autoCompletePossibleLocations,
      display: true,
    });
  };

  //
  // card #4 functions
  useEffect(() => {
    console.log("flow_Payment_Subscription() initiated");
    flow_Payment_Subscription();
    console.log("flow_Payment_Subscription() complete");
  }, []);

  useEffect(() => {
    setCost();
  });

  const flow_Payment_Subscription = () => {
    // props.subscription.plan = "Family";
    console.log("Delete me");
    console.log("Delete me");
    console.log("Delete me");
    console.log("Delete me");
    console.log("Delete me");
    console.log("Delete me");
    console.log("Delete me");

    // function sets the price equation to use to calculate
    // diagram: https://app.diagrams.net/#G11m5tUWMSwZDSU1_owxTNgF6aeeL_R0VK
    const { payment, subscription } = props;
    console.log("payment:  ", payment);
    console.log("subscription:  ", subscription);

    // check user plan
    if (subscription.plan == "N/A") {
      console.log("user has no plan");

      if (payment.brand === "") {
        console.log(
          "user does not have a card on file, sending user to payment screen"
        );
        // props.navigation.navigate("Payment");
        // return;
      }
      console.log("user has a card on file");
      console.log("setting the price equation to: noPlan");
      setSubscriptionType("noPlan");
      return;
    }

    console.log("user has a plan");

    var subscriptionEnds = new Date(subscription.periodEnd); // data manipulation
    console.log("subscription ends:  ", subscriptionEnds);
    console.log("today date:         ", TODAYS_DATE);

    let dateComparison = subscriptionEnds.getTime() < TODAYS_DATE.getTime();

    console.log("is the subscription invalid?:   ", dateComparison);
    console.log("subscription status:  ", subscription.status);

    // subscription.status = "active"; // delete me
    // dateComparison = true; // delete me

    if (!dateComparison || subscription.status !== "active") {
      console.log("user subscription is not valid");
      console.log("setting the price equation to: other");

      setSubscriptionType("other");
      return;
    }

    console.log("user subscription is valid");
    if (subscription.plan == "Family") {
      console.log("user has a Family subscription");

      if (subscription.lbsLeft >= lbsForJob) {
        console.log("user has the necessary lbs to complete job");
        console.log("lbs left:  ", subscription.lbsLeft - lbsForJob);
        setLbsLeft(subscription.lbsLeft - lbsForJob);
        return;
      }

      console.log("user does not have the necesary lbs to complete the job");
      console.log("setting the price equation to: family");
      setSubscriptionType("family");
      return;
    }

    console.log("user has either Student, Plus, or Student");

    if (subscription.lbsLeft >= lbsForJob) {
      console.log("user has the necessary lbs to complete job");
      console.log("lbs left:  ", subscription.lbsLeft - lbsForJob);
      setLbsLeft(subscription.lbsLeft - lbsForJob);
      return;
    }
    console.log("user does not have the necesary lbs to complete the job");
    console.log("setting the price equation to: other");
    setSubscriptionType("other");
    return;
  };

  const makePayment = async () => {
    console.log("makePayment() initiated");
    // console.log('props.user:  ',props.user)
    // lbsLeft - lbsForJob < 0 ? finalCost : 0
    // lbsLeft - lbsForJob < 0 ? finalCost : 0
    // initiated API call here
    // assume that the token for stripe is payment.regPaymentID

    // axios.defaults.headers.common["token"] = token;

    try {
      const fakeData = {
        email: props.user.email,
        fname: props.user.fname,
        lname: props.user.lname,
        phone: props.user.phone,
        coupon: "placeholder",
        scented: scent,
        delicates: delicate,
        separate: separate,
        towelsSheets: towelsSheets,
        washerPrefs: preferecenNote,
        address: pickUpAddress,
        addressPrefs: addressNote,
        loads: loadForJob,
        pickupDate: pickUpDate,
        pickupTime: displayTime,
        created: new Date(),
      };

      console.log("dakeData:  ", fakeData);

      const response = await axios.post(BASE_URL + "/api/order/placeOrder", {
        ...fakeData,
        // email: email,
        // fname: fname,
        // lname: lname,
        // phone: phone,
        // coupon: "placeholder",
        // scented: scent,
        // delicates: delicate,
        // separate: separate,
        // towelsSheets: towelsSheets,
        // washerPrefs: preferecenNote,
        // address: pickUpAddress,
        // addressPrefs: addressNote,
        // loads: loadForJob,
        // pickupDate: pickUpDate,
        // pickupTime: displayTime,
        // created: new Date(),
      });

      if (response.data.success) {
        console.log("new order succesful");
        console.log(" response.data.orderID:   ", response.data.orderID);
        // return { success: true, message: response.data.orderID };
      } else {
        // return { success: false, message: response.data.message };
        console.log("fail");
        console.log(response.data.message);
      }
    } catch (error) {
      // showConsoleError("placing order: ", error);
      console.log("error:  ", error);
      // return {
      //   success: false,
      //   message: caughtError("placing order", error, 99),
      // };
    }
  };

  const displayAddressNote = () => {
    if(addressNote.length>0){
      return (
        <View style={styles.fieldContainer}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameTxT}>Address Note:</Text>
          </View>
          <View
            style={[
              styles.fieldValueContainer,
              {
                flexDirection: "column",
                alignItems: "flex-end",
              },
            ]}
          >
            <Text style={styles.fieldValueTxT}>{addressNote}</Text>
          </View>
        </View>
      );
    }

  };

  const displayPreferences = () => {
    const preferencesArray = [
      scent ? "Scented" : null,
      delicate ? "Delicates" : null,
      separate ? "Separate" : null,
      towelsSheets ? "Towels/Sheets" : null,
    ];

    const preferencesArrayString = preferencesArray
      .filter((word) => word !== null)
      .toString();
    if (preferencesArrayString.length > 0) {
      return (
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
            <Text style={styles.fieldValueTxT}>{preferencesArrayString}</Text>
          </View>
        </View>
      );
    }
  };

  const displayPreferenceNote = () => {
    if (preferecenNote.length > 0) {
      return (
        <>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldNameContainer}>
              <Text style={styles.fieldNameTxT}>Preferences Note:</Text>
            </View>
            <View style={styles.fieldValueContainer}>
              <Text style={styles.fieldValueTxT}>
                {preferecenNote ? preferecenNote : null}
              </Text>
            </View>
          </View>
          <DIVIDER />
        </>
      );
    }
  };

  // useEffect(() => {
  //   // setLbsLeft(props.subscription.lbsLeft);
  //   console.log("CHANGE THIS");
  //   console.log("CHANGE THIS");
  //   console.log("CHANGE THIS");
  //   setLbsLeft(20);
  // }, []);

  useEffect(() => {
    setPriceBasedOnLoadNumber(loadForJob);
    setLbsForJob(LBS_PER_LOAD * loadForJob);
  }, [loadForJob]);

  const setCost = () => {
    if (subscriptionType == "family") {
      console.log("lbsForJob:  ", lbsForJob);
      setFinalCost(
        Math.abs((lbsLeft - lbsForJob) * FAMILY_PLAN_MULTIPLIER - coupon)
      );
      return;
    }
    if (subscriptionType == "other") {
      console.log("lbsForJob:  ", lbsForJob);

      setFinalCost(
        Math.abs((lbsLeft - lbsForJob) * NOT_FAMILY_PLAN_MULTIPLIER - coupon)
      );
      return;
    }
    if (subscriptionType == "noPlan") {
      console.log("lbsForJob:  ", lbsForJob);

      setFinalCost(
        Math.abs((lbsLeft - lbsForJob) * NO_PLAN_MULTIPLIER - coupon)
      );
      return;
    }
  };

  const returnWarningAboutLbsLeft = () => {
    console.log("returnWarningAboutLbsLeft()");
    if (lbsLeft - lbsForJob < 0) {
      return (
        <>
          <Text
            style={{ backgroundColor: "#ffe6e6", padding: 5, borderRadius: 20 }}
          >
            You are going over the monthly limit, there will be an additional
            cost
          </Text>
          {/*  */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldNameContainer}>
              <Text style={styles.fieldNameTxT}> Cost </Text>
            </View>
            <View style={styles.fieldValueContainer}>
              <Text style={styles.fieldValueTxT}>{finalCost} $/lbs</Text>
            </View>
          </View>
          {/* here */}
        </>
      );
    }
  };

  const setPriceBasedOnLoadNumber = (loadForJob) => {
    // only shown if user has no membership
    if (loadForJob == 1) {
      setPrice({
        withOutSubscription: (12.0).toFixed(2),
        withSubscription: (9.7).toFixed(2),
      });
    } else if (loadForJob == 1.5) {
      setPrice({
        withOutSubscription: (18.0).toFixed(2),
        withSubscription: 14.55,
      });
    } else if (loadForJob == 2) {
      setPrice({
        withOutSubscription: (24.0).toFixed(2),
        withSubscription: 19.39,
      });
    } else if (loadForJob == 2.5) {
      setPrice({
        withOutSubscription: (30.0).toFixed(2),
        withSubscription: 24.24,
      });
    } else if (loadForJob == 3) {
      setPrice({
        withOutSubscription: (36.0).toFixed(2),
        withSubscription: 29.09,
      });
    }
  };

  const returnSubscriptionPricesOrSubInformation = () => {
    if (props.subscription.plan == "N/A") {
      return (
        <View style={{ alignItems: "center" }}>
          <BUTTON
            style={{ width: WIDTH * 0.5 }}
            text={"$" + price.withOutSubscription}
          />
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
              or
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
            style={{ marginBottom: 1, marginTop: 0, width: WIDTH * 0.5 }}
            text={"$" + price.withSubscription}
          />
          <Text>with a subscription</Text>
        </View>
      );
    }

    // returns table with data about subscription if present
    return (
      <View>
        <View style={styles.fieldContainer}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameTxT}>Subscription </Text>
          </View>
          <View style={styles.fieldValueContainer}>
            <Text style={styles.fieldValueTxT}>{props.subscription.plan}</Text>
          </View>
        </View>
        {/*  */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameTxT}>Current status </Text>
          </View>
          <View style={styles.fieldValueContainer}>
            <Text style={styles.fieldValueTxT}>
              {props.subscription.status}
            </Text>
          </View>
        </View>
        {/*  */}
        <DIVIDER />
        {/*  */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameTxT}>lbsLeft </Text>
          </View>
          <View
            style={[styles.fieldValueContainer, { flexDirection: "column" }]}
          >
            <Text
              style={[
                styles.fieldValueTxT,
                { textAlign: "center", fontSize: 12 },
              ]}
            >
              lbsleft - lbsForJob
            </Text>
            <Text style={[styles.fieldValueTxT, { textAlign: "center" }]}>
              {lbsLeft - lbsForJob}
            </Text>
            {returnWarningAboutLbsLeft()}
          </View>
        </View>
      </View>
    );
  };

  const changeLoadNumber = (sign) => {
    if (sign == "+") {
      if (loadForJob == 3) {
        return;
      }
      setLoadForJob(loadForJob + 0.5);
      return;
    }
    if (loadForJob == 1) {
      return;
    }
    setLoadForJob(loadForJob - 0.5);
    return;
  };

  const setLoadImage = () => {
    if (loadForJob == 1) {
      return (
        <Image
          style={styles.imageDetails}
          source={require("../../assets/1_load_icon.png")}
        />
      );
    } else if (loadForJob == 1.5) {
      return (
        <Image
          style={styles.imageDetails}
          source={require("../../assets/1.5_load_icon.png")}
        />
      );
    } else if (loadForJob == 2) {
      return (
        <Image
          style={styles.imageDetails}
          source={require("../../assets/2_load_icon.png")}
        />
      );
    } else if (loadForJob == 2.5) {
      return (
        <Image
          style={styles.imageDetails}
          source={require("../../assets/2.5_load_icon.png")}
        />
      );
    } else if (loadForJob == 3) {
      return (
        <Image
          style={styles.imageDetails}
          source={require("../../assets/3_load_icon.png")}
        />
      );
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
              onPress={() =>
                setDay({
                  day: getDayValueFromNumber(DAY_NUMBER),
                  month: MONTH,
                  date: DATE,
                })
              }
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
              onPress={() =>
                setDay({
                  day: getDayValueFromNumber(DAY_NUMBER + 1),
                  month: MONTH,
                  date: DATE + 1,
                })
              }
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
              Monday through Friday from 10 am to 7 pm. There must be at least 1
              hour difference between the order time and current time.
            </Text>
          </TimeModal>
          <Text>
            Monday through Friday from 10 am to 7 pm. There must be at least 1
            hour difference between the order time and current time.
          </Text>
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
            maxLength={300}
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
      element: (
        <View style={styles.container}>
          <MapView
            style={styles.mapStyle}
            region={newRegion}
            ref={(ref) => (this.mapView = ref)}
            zoomEnabled={true}
            showsUserLocation={true}
            onMapReady={goToInitialLocation}
            initialRegion={initialRegion}
          >
            {/* <Marker coordinate={newRegion} /> */}
          </MapView>
          <View style={styles.topInputs_ButtonContainer}>
            <>
              <SearchBar
                term={pickUpAddress}
                onTermChange={(txt_address) => {
                  setAutoCompletePossibleLocations({
                    ...autoCompletePossibleLocations,
                    display: true,
                  });
                  setPickUpAddress(txt_address);
                }}
                onFocus={searchBarOnFocus}
                clear={() => {
                  setPickUpAddress("");
                  setPickUpAddressFromDropDown("");
                }}
              />
              {/* old searchbar below, just in case this search bar does not work */}

              {displayAutoCompletePossibleLocations()}
            </>
          </View>

          <TextInput
            value={addressNote}
            onChangeText={(txt) => setAddressNote(txt)}
            maxLength={300}
            multiline={true}
            placeholder="Special delivery instructions"
            style={[
              FIELD_VALUE_CONTAINER,
              {
                width: "100%",
                height: HEIGHT * 0.06,
                backgroundColor: "#f9f9f9",
                position: "absolute",
                bottom: 22,
              },
            ]}
          />
        </View>
      ),

      id: "card #3",
    },
    {
      element: (
        <View style={{ alignItems: "center" }}>
          {returnSubscriptionPricesOrSubInformation()}
          {setLoadImage()}
          <Text>Amount of loads to wash: {loadForJob}</Text>
          <Text>Amount of pounds to wash: {loadForJob * 8}</Text>

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
          <View style={styles.fieldContainer}>
            <View style={styles.fieldNameContainer}>
              <Text style={styles.fieldNameTxT}>Address:</Text>
            </View>
            <View
              style={[
                styles.fieldValueContainer,
                {
                  flexDirection: "column",
                  alignItems: "flex-end",
                },
              ]}
            >
              <Text style={[styles.fieldValueTxT, { color: "red" }]}>
                {pickUpAddressFromDropDown.split(",")[0] || null}
              </Text>
            </View>
          </View>

          {displayAddressNote()}
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

          {/*  */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldNameContainer}>
              <Text style={styles.fieldNameTxT}>Pickup Date:</Text>
            </View>
            <View style={styles.fieldValueContainer}>
              <Text style={styles.fieldValueTxT}>
                {[pickUpDate.day]}, {pickUpDate.month}/{pickUpDate.date}
              </Text>
            </View>
          </View>
          {/*  */}
          <DIVIDER />
          {/*  */}
          {displayPreferences()}
          {/*  */}
          {/*  */}
          {displayPreferenceNote()}
          {/*  */}

          {/*  */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldNameContainer}>
              <Text style={styles.fieldNameTxT}>Estimated Total:</Text>
            </View>
            <View style={styles.fieldValueContainer}>
              <Text style={styles.fieldValueTxT}>
                ${lbsLeft - lbsForJob < 0 ? finalCost : 0}
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
        openDrawer={() => props.navigation.navigate("Home")}
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
            text={index == ITEMS.length - 1 ? "Submit" : "Next"}
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
    width: "50%",
    // backgroundColor:'red',
  },
  fieldNameTxT: {
    fontSize: FIELD_VALUE_FONT_SIZE,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  fieldValueContainer: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  fieldValueTxT: {
    fontSize: FIELD_VALUE_FONT_SIZE,
    // fontWeight: "bold",
    paddingRight: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  topInputs_ButtonContainer: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 22,
  },
  menuIcon: {
    paddingLeft: 15,
  },
  searchBoxContainer: {
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#f9f9f9",
    backgroundColor: "#f9f9f9",
    ...SHADOW,
  },
  icon: {
    width: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  addressTextInput: {
    width: "85%",
    height: 45,
    paddingLeft: 10,
  },
  bottomButtonsContainer: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 40,
    height: HEIGHT * 0.2,
    width: WIDTH,
    alignItems: "center",
  },
  bottomInnerButtonsContainer: {
    flexDirection: "row",
    position: "relative",
    paddingTop: 10,
  },
  newOrderButton: {
    backgroundColor: "#f9f9f9",
    position: "relative",
    justifyContent: "center",
    borderColor: "#f9f9f9",
    width: WIDTH * 0.8,
    height: 50,
    borderWidth: 1,
    borderRadius: 20,
    ...SHADOW,
  },
  noCard_FAQButton: {
    height: 50,
    width: 50,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#f9f9f9",
    position: "relative",
    borderWidth: 1,
    borderRadius: 20,
    width: WIDTH * 0.4,
    ...SHADOW,
  },
});

function mapStateToProps({ payment, subscription, user }) {
  return { payment, subscription, user };
}
export default connect(mapStateToProps)(NewOrderScreen);

//returnSubscriptionPricesOrSubInformation
