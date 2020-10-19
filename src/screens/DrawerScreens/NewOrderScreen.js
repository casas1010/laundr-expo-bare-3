import React, { useState, useEffect } from "react";
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
import { GOOGLE_MAPS_KEY } from "../../key/";

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
} from "../../components/Items/";
// import
import Header from "../../components/Header";
import Container from "../../components/Container";
import Map from "./Map";
import moment from "moment";

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
    onTimeChange();
  }, []);

  useEffect(() => {
    onTimeChange();
  }, [pickUpDate]);


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
    setDate(currentDate);
    const str = JSON.stringify(currentDate);

    var time = {
      hour: str.slice(12, 14),
      minute: str.slice(15, 17),
      allowed: true,
    };

    // the following code {} changes the time format only
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

  const [initialRegion, setInitialRegion] = useState(undefined);
  const [newRegion, setNewRegion] = useState();
  const [loading, setLoading] = useState(true);
  // const [address, setAddress] = useState(props.route.params.address);
  const [
    autoCompletePossibleLocations,
    setAutoCompletePossibleLocations,
  ] = useState({ display: true, array: [] });
  const [error, setError] = useState("");

  // functions that run  the first time page loads
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
    console.log("HomeScreen useEffect() [pickUpAddress]");
    addresAutoComplete();
  }, [pickUpAddress]);
  // functions that run  the first time page loads
  //

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
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${sanitizedAddress}&key=${GOOGLE_MAPS_KEY}`;
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
      //<Map props={props.route.params} addressHelper={addressHelper} />,

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
            <Marker coordinate={newRegion} />
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
                // onBlur={searchBarOnBlur}
              />
              {/* old searchbar below, just in case this search bar does not work */}

              {displayAutoCompletePossibleLocations()}
            </>
          </View>
        </View>
      ),

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
                {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  backgroundColor: "red",
                },
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
export default NewOrderScreen;

// const current24Time = moment().format("HH:mm:ss");
// const current12Time = moment().format("hh:mm:ss");
// const current24TimeHour = current24Time.slice(0, 2);
// const current12TimeHour = current12Time.slice(0, 2);
// const currentMinute = current12Time.slice(3, 5);
// console.log("current24Time   ", current24Time);
// console.log("current24TimeHour:  ", current24TimeHour);
// console.log("current12Time   ", current12Time);
// console.log("current12TimeHour:  ", current12TimeHour);
// console.log("currentMinute:  ", currentMinute);

// const OPENING_HOURS = 7;
// const CLOSING_HOURS = 19;

// function checkIfHourIsBetweenWorkingHours(currentHour) {
//   console.log("currentHour:  ", currentHour);
//   if (OPENING_HOURS <= currentHour && CLOSING_HOURS >= currentHour) {
//     console.log("current time IS between working hours");
//     return true;
//   }
//   console.log("current time is NOT between working hours");
//   return false;
// }

// if (!checkIfHourIsBetweenWorkingHours(time.hour)) {
//   time.allowed = false;
//   setDisplayTime(time);
//   return;
// }

// let dayDifference = pickUpDate.date - DATE;
// console.log("dayDifference::", dayDifference);
// if (dayDifference == 1) {
//   setDisplayTime(time);
//   return;
// }

// console.log("CURRENT HOUR");
