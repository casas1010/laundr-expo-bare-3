import { AsyncStorage } from "react-native";
import {
  EMAIL_LOGIN_SUCCESS,
  EMAIL_LOGIN_FAIL,
  LOG_OUT,
  CLEAR_DATA,
  CLEAR_HISTORY,
  ADD_USER_INFORMATION,
  GET_CARD_DETAILS,
} from "./types";
import jwt_decode from "jwt-decode";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { addUserInformation } from "./user_actions";
import { fetchPaymentInfo } from "./payment_actions";
import { fetchOrders } from "../actions/history_actions";
import { addSubscriptionInformation } from "./subscription_actions";
import { BASE_URL } from "../key/";
//const response = await axios.post("http://192.168.1.69:5000/api/user/login", {

export const emailLogOut = (props) => async (dispatch) => {
  console.log("emailLogOut() action invoked");

  await AsyncStorage.removeItem("token");
  await SecureStore.deleteItemAsync("password");

  console.log("token has been cleared from phone");
  props.navigate("Home");
  props.navigate("welcome");
  dispatch({ type: CLEAR_DATA });
  dispatch({ type: LOG_OUT });
  dispatch({ type: CLEAR_HISTORY });
};

const validateEmail = (email) => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return true;
};

export const doAuthLogin = (props) => async (dispatch) => {
  console.log("doAuthLogin() action invoked");
  let token = await AsyncStorage.getItem("token");
  if (token) {
    console.log("token is present");
    console.log("decoding token and checking crendetials");
    const email = jwt_decode(token).email;
    const password = await SecureStore.getItemAsync("password");
    console.log("decoded email:  ", email);
    console.log("decoded password:  ", password);

    try {
      const response = await axios.post(BASE_URL + "/api/user/login/", {
        email: email.toLowerCase(),
        password: password,
      });
      console.log("response.data.success: ", response.data.success);
      if (response.data.success) {
        const token = response.data.token;

        // await AsyncStorage.setItem("token", token);
        // await SecureStore.setItemAsync("password", props.password);
        const data = jwt_decode(token);

        // console.log("data from token:  ", data.email);

        dispatch(addUserInformation(data));
        dispatch(fetchPaymentInfo(data));
        dispatch(addSubscriptionInformation(data));
        dispatch(fetchOrders(email.toLowerCase()));

        dispatch({ type: EMAIL_LOGIN_SUCCESS, payload: token });

        setTimeout(() => {
          console.log("navigating user to drawer");
          props.navigation.navigate("drawer");
        }, 3000);

        return;
      } else {
        console.log("Login failed, token has not been received");
        console.log(props.navigation.navigate("welcome"));

        dispatch({ type: EMAIL_LOGIN_FAIL });
        return;
      }
    } catch (error) {
      console.log(props.navigation.navigate("welcome"));
      alert("Login failed, there has been an error in the request");
      console.log("Login failed, there has been an error in the request");

      console.log(error);
      dispatch({ type: EMAIL_LOGIN_FAIL });
      return;
    }
  } else {
    console.log(props.navigation.navigate("welcome"));
  }
};

export const emailLogin = (props) => async (dispatch) => {
  console.log("emailLogin() action invoked");
  let token = await AsyncStorage.getItem("token");
  if (token) {
    console.log("token is present");
    console.log("decoding token and checking crendetials");
    const email = jwt_decode(token).email;
    const password = await SecureStore.getItemAsync("password");
    console.log("decoded email:  ", email);
    console.log("decoded password:  ", password);

    dispatch(doEmailLogin({ email, password }));
  } else {
    console.log("token not present");
    dispatch(doEmailLogin(props));
  }
};

export const doEmailLogin = (props) => async (dispatch) => {
  console.log("doEmailLogin() action helper invoked");

  if (validateEmail(props.email) && validatePassword(props.password)) {
    console.log("Email and password have valid syntax");

    try {
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
        dispatch(fetchPaymentInfo(data));
        dispatch(addSubscriptionInformation(data));
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
      alert("Login failed, there has been an error in the request");
      console.log(error);
      dispatch({ type: EMAIL_LOGIN_FAIL });
      return;
    }
  } else {
    alert("There is an issue with the email or password inputed");
    console.log("Email and password dont have valid syntax");
  }
};



