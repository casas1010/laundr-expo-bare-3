import {
  EMAIL_LOGIN_SUCCESS,
  EMAIL_LOGIN_FAIL,
  LOG_OUT,
} from "../actions/types";
import { View, AsyncStorage, Image } from "react-native";

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case EMAIL_LOGIN_SUCCESS:
     console.log('EMAIL_LOGIN_SUCCESS reducer invoked')
      console.log("Email Login Success");
      return { token: action.payload };

    case EMAIL_LOGIN_FAIL:
      return { token: null };

    case LOG_OUT:
      console.log('LOG_OUT reducer invoked')

      // console.log("token has been cleared from the store");
      // console.log("before:  ", checkToken());
      // AsyncStorage.setItem("token", null);
      // console.log("after:    ", checkToken());

      return { token: null };

    default:
      return state;
  }
};

export default authReducer;
