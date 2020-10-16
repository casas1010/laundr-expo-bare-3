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
  // dispatch(fetchPaymentInfo(data.stripe.regPaymentID));

  let localData = {
    __v: data._v,
    _id: data._id,
    city: data.city,
    email: data.email,
    fname:  data.fname, 
    iat: data.iat,
    isAdmin: data.isAdmin,
    isDriver: data.isDriver,
    isWasher: data.isWasher , 
    lname: data.lname,
    phone: data.phone,
  };

  dispatch({
    type: ADD_USER_INFORMATION,
    payload: localData,
  });
};
