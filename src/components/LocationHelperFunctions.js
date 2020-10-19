import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { GOOGLE_MAPS_KEY } from "../key";

export const verifyAddressIsInBounds = async (location) => {
  console.log(`verifiying location item: ${location}`);
  let userDistance = await getDistanceFromLatLon(
    location.latitude,
    location.longitude
  );
  if (!checkIfUserIsInZone(userDistance)) {
    return false;
  }
  return true;
};

export const getUserLocation = async () => {
  console.log("getUserLocation initiated");
  let { status } = await Location.requestPermissionsAsync();
  if (status !== "granted") {
    setErrorMsg("Permission to access location was denied");
  }

  let location = await Location.getCurrentPositionAsync({});
  console.log("expo-location:   ", location);

  const userLocation = {
    latitude: parseFloat(location.coords.latitude),
    longitude: parseFloat(location.coords.longitude),
  };
  console.log("getUserLocation completed");
  return userLocation;
};

export const getAddressFromLatLong = async (lat, long) => {
  console.log("getAddressFromLatLong()");
  console.log(`getting address from lat:  ${lat}, long:${long}`);
  let possibleLocationsFromLatLong = [];
  let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&components=country:US
  &key=${GOOGLE_MAPS_KEY}`;
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
  return bestGuessForLatLongLocation;
};

export const sortThroughLocations = (possibleUsersLocations) => {
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

// perform API call to get coordinates from the address state variable
export const getLatLongFromAddress = async (adr) => {
  console.log("getLatLongFromAddress() initiated");
  if (adr === undefined || adr === "") {
    console.log("address is undefined or its empty");
    console.log("exiting addresAutoComplete() without API call");
    return null;
  }
  console.log(`initiated API to get coordinates for address: ${adr}`);
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${adr}&components=country:US
  &key=${GOOGLE_MAPS_KEY}`;
  let locationObj = {};
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // console.log(`the coordinates for the address ${address} are:`);
      // console.log(data.results[0]["geometry"]["location"]);
      locationObj["latitude"] = data.results[0]["geometry"]["location"]["lat"];
      locationObj["longitude"] = data.results[0]["geometry"]["location"]["lng"];
    })
    .catch((err) => console.warn(err.message));
  console.log("getLatLongFromAddress() complete");

  return locationObj;
};

const gainesvilleLat = 29.6499;
const gainesvilleLong = -82.3486;
// gets distance between user and gainsvilles given location
export const getDistanceFromLatLon = (lat1, lon1) => {
  console.log(`getDistanceFromLatLon() initiated with lat:${lat1}  and ${lon1}`);

  console.log("calculating distance from gainsville headquarters");

  const lat2 = gainesvilleLat;
  const lon2 = gainesvilleLong;

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c * 1000; // Distance in m
  console.log(
    "the distance between the user and gainsville headquarters is ",
    d
  );
  console.log(`getDistanceFromLatLon() complete`);

  return d;
};
// verifies if the distances is within the gainsville zone
export const checkIfUserIsInZone = (distance) => {
  console.log("clientsDistance:   ", distance);
  if (distance < 16094) {
    return true;
  }
  return false;
};
