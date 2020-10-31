//        TEST DIFFERNT LAG TIMES FOR ADDRESS AUTODISPLAY
//        .5 SECONDS SHOULD BE GOOD?
// remove boing animation

import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { BUTTON } from "../../components/Items/";
import MapView, { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";

import {
  getLatLongFromAddress,
  verifyAddressIsInBounds,
} from "../../components/LocationHelperFunctions";
import Container from "../../components/Container";
import {
  HEIGHT,
  WIDTH,
  SHADOW,
} from "../../components/Items/";
import { GOOGLE_MAPS_KEY } from "../../key/";
import SearchBar from "../../components/SearchBar";
import LoaderModal from "../../components/LoaderModal";

let acTimeout;
const HomeScreen = (props) => {

  const [loading, setLoading] = useState(false);

  const [initialRegion, setInitialRegion] = useState(undefined);
  const [newRegion, setNewRegion] = useState();

  const [userAddress, setUserAddress] = useState();
  const [pickedAddressFromDropDown, setPickedAddressFromDropDown] = useState('');
  const [address, setAddress] = useState();
  const [
    autoCompletePossibleLocations,
    setAutoCompletePossibleLocations,
  ] = useState({ display: true, array: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("useEffect() HomeScreen []");
    setUserLocation();
  }, []);
  const setUserLocation = async () => {
    console.log("setUserLocation() initiated");
    const userLocation = await props.location.address;
    console.log("setting userAddress state variable:   ", userLocation);
    setUserAddress(userLocation);
    console.log("setting address state variable");
    setAddress(userLocation);
    setPickedAddressFromDropDown(userLocation || '')
    console.log("setUserLocation() complete");
  };
  function goToInitialLocation() {
    console.log("goToInitialLocation() initiated");
    let initialRegion = props.location.location;

    this.mapView.animateToRegion(initialRegion, 2000);
    console.log("goToInitialLocation() complete");
  }
  useEffect(() => {
    console.log("HomeScreen useEffect() [address]");
    clearTimeout(acTimeout);
    acTimeout = setTimeout(function () {
      console.log("inside useEffect!");
      addresAutoComplete();
    }, 1200);
  }, [address]);

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


    console.log("initiating API call for address:  ", address);
    let possibleLocations = [];
    let sanitizedAddress = address.replace(/ /g, "+");
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
    console.log("auto complete for input address & API complete");
    console.log(`possibleLocations size:  `, possibleLocations.length);
    console.log("updating the state variable autoCompletePossibleLocations");
    // let obj = {
    //   ...autoCompletePossibleLocations,
    //   array: [...possibleLocations],
    // };
    // setAutoCompletePossibleLocations(obj);
    setAutoCompletePossibleLocations({...autoCompletePossibleLocations,array:[...possibleLocations]});
  };

  const setNewRegionHelper = async (adr) => {
    console.log("setNewRegion() initiated");
    // setLoading(true);
    let latLongFromAddress = await getLatLongFromAddress(adr);
    // setLoading(false);
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
    console.log('pickedAddressFromDropDown:  ',pickedAddressFromDropDown)
    if(pickedAddressFromDropDown==='' ||pickedAddressFromDropDown!==address ){
      alert("Please enter an address, then pick a suggested address from the dropdown");
      console.log("exiting newOrder()");
      return
    }
    const location = await getLatLongFromAddress(pickedAddressFromDropDown);


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
    props.navigation.navigate("New Order Screen", { address: pickedAddressFromDropDown, location });
  };

  const displayAutoCompletePossibleLocations = () => {
    console.log("displayAutoCompletePossibleLocations()");
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
                setPickedAddressFromDropDown(item)
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

  const paymentButtonText = () => {
    if (props.payment.lastFour !== null) {
      return (
        <>
          <AntDesign name="creditcard" size={18} color="white" />
          <Text> {props.payment.lastFour}</Text>
        </>
      );
    }
    return <Text>Add Card</Text>;
  };

  return (
    <View style={styles.container}>
      <LoaderModal loading={loading} />
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
          <TouchableOpacity onPress={props.navigation.openDrawer}>
            <Entypo
              name="menu"
              size={50}
              color="#01c9e2"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>

          <SearchBar
            term={address}
            onTermChange={(txt_address) => {
              setAutoCompletePossibleLocations({
                ...autoCompletePossibleLocations,
                display: true,
              });
              setAddress(txt_address);
            }}
            placeholder="Search Locations"
            onFocus={searchBarOnFocus}
            clear={()=>{
              setAddress(''); 
              setPickedAddressFromDropDown('')

            }}
          />

          {displayAutoCompletePossibleLocations()}
        </>
      </View>

      <View style={styles.bottomButtonsContainer}>
        <BUTTON onPress={newOrder} text="New Order" />
        <View style={styles.bottomInnerButtonsContainer}>
          <BUTTON
            onPress={() => {
              props.navigation.navigate("Payment");
            }}
            style={{ width: WIDTH * 0.4 }}
          >
            {paymentButtonText()}
          </BUTTON>

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

function mapStateToProps({ location, payment }) {
  return { location, payment };
}
// export default HomeScreen;
export default connect(mapStateToProps)(HomeScreen);
