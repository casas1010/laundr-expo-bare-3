import {
  ADD_USER_INFORMATION,
  ADD_USER_LAT_LONG,
  GET_CARD_DETAILS,
  ADD_USER_ADDRESS,
} from "../actions/types";
import * as Location from "expo-location";
import { GOOGLE_MAPS_KEY, BASE_URL } from "../key";
import axios from "axios";
// fetchPaymentInfo(data.stripe.regPaymentID, dispatch);

export const addUserInformation = (data) => (dispatch) => {
  console.log("addUserInformation() action invoked");
  fetchPaymentInfo(data.stripe.regPaymentID, dispatch);
  console.log('DATA:  ',data)
  dispatch({
    type: ADD_USER_INFORMATION,
    payload: data,
  });

};


export const fetchPaymentInfo = async (regPaymentID, dispatch) => {
  console.log("fetchPaymentInfo() action invoked");
  let cardInfo = {
    brand: "",
    expMonth: "",
    expYear: "",
    lastFour: "",
  };

  try {
    const response = await axios.post(BASE_URL + "/api/stripe/getCardDetails", {
      paymentID: regPaymentID,
    });

    if (response.data.success) {
      const card = response.data.message.card;

      cardInfo = {
        brand: card.brand.toUpperCase(),
        expMonth: card.exp_month,
        expYear: card.exp_year,
        lastFour: card.last4,
      };

      // return { type: GET_CARD_DETAILS, payload: cardInfo}
      dispatch({ type: GET_CARD_DETAILS, payload: cardInfo });
    } else {
      // return { type: GET_CARD_DETAILS, payload: cardInfo}
      dispatch({ type: GET_CARD_DETAILS, payload: cardInfo });
    }
  } catch (error) {
    console.log("error");
    console.log(error);
    // return { type: GET_CARD_DETAILS, payload: cardInfo}
    dispatch({ type: GET_CARD_DETAILS, payload: cardInfo });
  }
};

export const getUserLocation = () => (dispatch) => {
  console.log("getUserLocation() action initiated");
  getUserLatLong(dispatch);
  console.log("getUserLocation() action complete");
};

const getUserLatLong = async (dispatch) => {
  console.log("getUserLatLong() action initiated");
  let { status } = await Location.requestPermissionsAsync();
  if (status !== "granted") {
    setErrorMsg("Permission to access location was denied");
  }

  let location = await Location.getCurrentPositionAsync({});
  console.log("expo-location:   ", location);

  const userLatLong = {
    latitude: parseFloat(location.coords.latitude),
    longitude: parseFloat(location.coords.longitude),
  };

  dispatch(setAddressFromLatLong(userLatLong.latitude, userLatLong.longitude));

  dispatch({
    type: ADD_USER_LAT_LONG,
    payload: userLatLong,
  });

  console.log("getUserLatLong() action complete");
};

const setAddressFromLatLong = (lat, long) => async (dispatch) => {
  console.log("setAddressFromLatLong() action initiated");
  console.log(`getting address from lat:  ${lat}, long:${long}`);
  let possibleLocationsFromLatLong = [];
  const KEY = GOOGLE_MAPS_KEY;
  const LAT = lat;
  const LNG = long;
  let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${LAT},${LNG}&key=${KEY}`;
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; data.results.length > i; i++) {
        if (data.results[i]["geometry"]["location_type"] != "APPROXIMATE") {
          possibleLocationsFromLatLong.push({
            address: data.results[i]["formatted_address"],
            location: data.results[i]["geometry"]["location_type"],
          });
        }
      }
    })
    .catch((err) => console.warn(err.message));

  console.log(
    `possible locations from LatLong :  ${possibleLocationsFromLatLong}`
  );
  const bestGuessForLatLongLocation = sortThroughLocations(
    possibleLocationsFromLatLong
  );
  dispatch({
    type: ADD_USER_ADDRESS,
    payload: bestGuessForLatLongLocation,
  });
  console.log("setAddressFromLatLong() action complete");
};

const sortThroughLocations = (possibleUsersLocations) => {
  console.log("sortThroughLocations()");
  // console.log("possibleUsersLocations:  ", possibleUsersLocations);
  const typesArray = ["GEOMETRIC_CENTER", "RANGE_INTERPOLATED", "ROOFTOP"];
  let usersLocationBestGuess = null;

  //o^2:   :(
  for (let i = 0; i < typesArray.length; i++) {
    for (let I = 0; I < possibleUsersLocations.length; I++) {
      if (typesArray[i] == possibleUsersLocations[I]["location"]) {
        usersLocationBestGuess = possibleUsersLocations[I]["address"];
        console.log(
          "The best guess for the users location is:  ",
          usersLocationBestGuess
        );
        return usersLocationBestGuess;
      }
    }
  }
};
