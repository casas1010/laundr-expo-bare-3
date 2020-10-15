import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Linking,
  Image,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { BUTTON } from "../../components/Items/";
import MapView, { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
//
import {
  getLatLongFromAddress,
  verifyAddressIsInBounds,
} from "../../components/LocationHelperFunctions";
import Container from "../../components/Container";
import { HEIGHT, WIDTH, SHADOW,KEYBOARD_AWARE_SCROLL_VIEW_STYLE } from "../../components/Items/";
import { GOOGLE_MAPS_KEY } from "../../key/";
import SearchBar from "../../components/SearchBar";

let addresAutoCompleteCount = 1;
let loadCount = 1;
// future improvement: use axios on API calls

const HomeScreen = (props) => {
  console.log("HomeScreen is loaded");
  console.log("number of times loaded:", loadCount);
  loadCount = loadCount + 1;

  const [initialRegion, setInitialRegion] = useState(undefined);
  const [newRegion, setNewRegion] = useState();
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState();
  const [address, setAddress] = useState();
  const [
    autoCompletePossibleLocations,
    setAutoCompletePossibleLocations,
  ] = useState({ display: true, array: [] });
  const [error, setError] = useState("");

  // functions that run  the first time page loads
  //
  useEffect(() => {
    console.log("useEffect() HomeScreen []");
    setUserLocation();
  }, []);
  const setUserLocation = async () => {
    console.log("setUserLocation() initiated");
    const userLocation = await props.user.address;
    console.log("setting userAddress state variable:   ", userLocation);
    setUserAddress(userLocation);
    console.log("setting address state variable");
    // setAddress("Services, Rec Center, Gainesville, FL, USA");  // delete me
    setAddress(userLocation);
    console.log("setUserLocation() complete");
  };
  function goToInitialLocation() {
    console.log("goToInitialLocation() initiated");

    let initialRegion = {
      latitude: props.user.location.latitude,
      longitude: props.user.location.longitude,
    };
    initialRegion["latitudeDelta"] = 0.005; // sets zoom level
    initialRegion["longitudeDelta"] = 0.005; // sets zoom level
    this.mapView.animateToRegion(initialRegion, 2000);
    console.log("goToInitialLocation() complete");
  }
  useEffect(() => {
    console.log("HomeScreen useEffect() [address]");
    addresAutoComplete();
  }, [address]);
  // functions that run  the first time page loads
  //

  const addresAutoComplete = async () => {
    console.log(`addresAutoComplete() initiated for address:  ${address} `);
    if (address == "") {
      console.log("address is empty");
      console.log("exiting addresAutoComplete() without API call");
      setAutoCompletePossibleLocations({ display: false, array: [] });
      return;
    }
    if (address === userAddress) {
      console.log(`address and clients address are the same`);
      console.log("exiting addresAutoComplete() without API call");
      setAutoCompletePossibleLocations({ display: false, array: [] });
      return;
    }
    if (address == undefined) {
      console.log(`address is undefined`);
      console.log("exiting addresAutoComplete() without API call");
      setAutoCompletePossibleLocations({ display: false, array: [] });
      return;
    }
    if (userAddress == undefined) {
      console.log(`userAddress is undefined`);
      console.log("exiting addresAutoComplete() without API call");
      setAutoCompletePossibleLocations({ display: false, array: [] });
      return;
    }

    console.log(
      "number of times addresAutoComplete() loaded:  ",
      addresAutoCompleteCount
    );
    addresAutoCompleteCount++;

    console.log("initiating API call for address:  ", address);
    let possibleLocations = [];
    let sanitizedAddress = address.replace(/ /g, "+");
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
    console.log("auto complete for input address & API complete");
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

  const newOrder = async () => {
    console.log("newOrder() initiated");
    const location = await getLatLongFromAddress(address);
    if (location === null) {
      alert("Please enter an address to proceed");
      console.log("exiting newOrder()");

      return;
    }
    const addressVerificatioBoolean = await verifyAddressIsInBounds(location);
    console.log("addressVerificatioBoolean:   ", addressVerificatioBoolean);
    if (!addressVerificatioBoolean) {
      console.log("user is out of range");
      alert(
        `Sorry!  You are currently out of Lanndr' active service area. Visit the site to request Landr at your location`
      );
      return;
    }

    console.log("user is in range!");
    props.navigation.navigate("New Order Screen", { address, location });
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
                setAddress(item);
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
  const searchBarOnBlur = () => {
    console.log("unFocus has fired");
    setAutoCompletePossibleLocations({
      ...autoCompletePossibleLocations,
      display: false,
    });
  };

  return (
    <View style={styles.container}>
      {/* <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={{flex:1}}
        showsVerticalScrollIndicator={false}
      > */}
        <MapView
          style={styles.mapStyle}
          region={newRegion}
          // followUserLocation={true}
          ref={(ref) => (this.mapView = ref)}
          zoomEnabled={true}
          showsUserLocation={true}
          onMapReady={goToInitialLocation}
          initialRegion={initialRegion}
        >
          <Marker coordinate={newRegion} />
        </MapView>
        <View style={styles.topInputs_ButtonContainer}>
          <TouchableOpacity
            onPress={props.navigation.openDrawer}
            style={{ backgroundColor: "red" }}
          >
            {/* <Image source={require("../../assets/spinner.png")} /> */}
            <Entypo name="menu" size={50} color="#01c9e2" />
          </TouchableOpacity>
          <>
            <SearchBar
              term={address}
              onTermChange={(txt_address) => {
                setAutoCompletePossibleLocations({
                  ...autoCompletePossibleLocations,
                  display: true,
                });
                setAddress(txt_address);
              }}
              onFocus={searchBarOnFocus}
              // onBlur={searchBarOnBlur}
            />
            {/* old searchbar below, just in case this search bar does not work */}

            {displayAutoCompletePossibleLocations()}
          </>
        </View>
        <View style={styles.bottomButtonsContainer}>
          <BUTTON onPress={newOrder} text="New Order" />
          <View style={styles.bottomInnerButtonsContainer}>
            <BUTTON
              // onPress={() => {
              //   Linking.openURL("https://www.laundr.io/faq/");
              // }}
              style={{ width: WIDTH * 0.4 }}
              text="No Card"
            />

            <BUTTON
              onPress={() => {
                Linking.openURL("https://www.laundr.io/faq/");
              }}
              style={{ width: WIDTH * 0.4 }}
              text="FAQ"
            />
          </View>
        </View>
      {/* </KeyboardAwareScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
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

function mapStateToProps({ user }) {
  return { user };
}
// export default HomeScreen;
export default connect(mapStateToProps)(HomeScreen);

//   <View style={styles.searchBoxContainer}>
//   <FontAwesome5
//     name="search-location"
//     size={18}
//     color="black"
//     style={styles.icon}
//   />
//   <TextInput
//     value={address}
//     onChangeText={(txt_address) => {
//       setAutoCompletePossibleLocations({
//         ...autoCompletePossibleLocations,
//         display: true,
//       });
//       setAddress(txt_address);
//     }}
//     placeholder="Address"
//     style={styles.addressTextInput}
//     returnKeyLabel={"Search"}
//     onBlur={() => {
//       console.log("unFocus has fired");
//       setAutoCompletePossibleLocations({
//         ...autoCompletePossibleLocations,
//         display: false,
//       });
//     }}
//     onFocus={() => {
//       console.log("onFocus has fired");
//       setAutoCompletePossibleLocations({
//         ...autoCompletePossibleLocations,
//         display: true,
//       });
//     }}
//   />
//   <TouchableOpacity
//     style={{ alignItems: "center", justifyContent: "center" }}
//     onPress={() => {
//       setAutoCompletePossibleLocations({ display: false, array: [] });
//       setAddress("");
//     }}
//   >
//     <Feather
//       name="x"
//       size={24}
//       color="black"
//       // style={{ backgroundColor: "red" }}
//     />
//   </TouchableOpacity>
// </View>
