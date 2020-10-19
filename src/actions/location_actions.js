import {
  ADD_USER_LAT_LONG,
  ADD_USER_ADDRESS,
  ADD_DEFAULT_LAT_LONG,
  ADD_DEFAULT_ADDRESS,
} from "../actions/types";
import * as Location from "expo-location";
import { GOOGLE_MAPS_KEY, BASE_URL } from "../key";
import axios from "axios";

export const getUserLocation = () => async (dispatch) => {
  console.log("getUserLocation() action initiated");
  await dispatch(getUserLatLong());
  console.log("getUserLocation() action complete");
};


const getUserLatLong = () => async (dispatch) => {

  console.log("getUserLatLong() ACTION initiated");
  let { status } = await Location.requestPermissionsAsync();
  if (status !== "granted") {
    // setErrorMsg("Permission to access location was denied");
    console.log("User denied sharing location");

    dispatch({
      type: ADD_DEFAULT_LAT_LONG,
    });
    dispatch({
      type: ADD_DEFAULT_ADDRESS,
    });

    return;
  }
  console.log('User has shared location')

  let location = await Location.getCurrentPositionAsync({});

  const userLatLong = {
    latitude: parseFloat(location.coords.latitude),
    longitude: parseFloat(location.coords.longitude),
  };
  userLatLong["latitudeDelta"] = 0.005; // sets zoom level
  userLatLong["longitudeDelta"] = 0.005; // sets zoom level

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
