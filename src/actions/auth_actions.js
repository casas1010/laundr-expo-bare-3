import { AsyncStorage } from "react-native";
import {
  EMAIL_LOGIN_SUCCESS,
  EMAIL_LOGIN_FAIL,
  LOG_OUT,
  CLEAR_DATA,
  ADD_USER_INFORMATION,
  GET_CARD_DETAILS,
} from "./types";
import jwt_decode from "jwt-decode";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { fetchPaymentInfo, addUserInformation } from "./user_actions";
import { fetchOrders } from "../actions/history_actions";
import { BASE_URL } from "../key/";

export const emailLogOut = (props) => async (dispatch) => {
  // get the fb token if it is there
  await AsyncStorage.removeItem("token");
  console.log("token has been cleared from phone");
  props.navigate("Home");
  props.navigate("welcome");
  dispatch({ type: CLEAR_DATA });
  dispatch({ type: LOG_OUT });
};

export const emailLogin = (props) => async (dispatch) => {
  console.log("emailLogin() action invoked");
  // get the token token if it is there
  let token = await AsyncStorage.getItem("token");

  // check the value of that token
  if (token) {
    console.log("token is present");

    dispatch({ type: EMAIL_LOGIN_SUCCESS, payload: token });
  } else {
    console.log("token not present");
    doEmailLogin(dispatch, props);
  }
};

const doEmailLogin = async (dispatch, props) => {
  console.log("doEmailLogin() action helper invoked");
  // if (this.handleInputValidation()) {   // UNCOMMENT ME
  try {
    //const response = await axios.post("http://192.168.1.69:5000/api/user/login", {
    const response = await axios.post(BASE_URL + "/api/user/login/", {
      email: props.email.toLowerCase(),
      password: props.password,
    });
    if (response.data.success) {
      const token = response.data.token;

      await AsyncStorage.setItem("token", token);
      await SecureStore.setItemAsync("password", props.password);
      const data = jwt_decode(token);
      dispatch(addUserInformation(data));

      dispatch(fetchOrders(props.email.toLowerCase()));

      dispatch({ type: EMAIL_LOGIN_SUCCESS, payload: token });

      return;
    } else {
      console.log("Login failed, token has not been received");

      dispatch({ type: EMAIL_LOGIN_FAIL });
      return;
    }
  } catch (error) {
    console.log("Login failed, there has been an error in the request");

    console.log(error);
    dispatch({ type: EMAIL_LOGIN_FAIL });
    return;
  }
  console.log("weird");
};
