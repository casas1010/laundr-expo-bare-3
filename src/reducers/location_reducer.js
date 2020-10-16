import {
  ADD_USER_LAT_LONG,
  ADD_USER_ADDRESS,
  ADD_DEFAULT_LAT_LONG,
  ADD_DEFAULT_ADDRESS,
} from "../actions/types";

const DEFAULT_LAT_LONG_LOCATION = {
  latitude: 29.6436,
  longitude: -82.3549,
  latitudeDelta: 1,
  longitudeDelta: 1,
};

const DEFAULT_ADDRESS = "Gainesville, FL 32611";

const locationReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_USER_LAT_LONG:
      console.log("ADD_USER_LAT_LONG reducer invoked");
      return { ...state, location: action.payload };
    case ADD_USER_ADDRESS:
      console.log("ADD_USER_ADDRESS reducer invoked");
      return { ...state, address: action.payload };
    case ADD_DEFAULT_LAT_LONG:
      console.log("ADD_DEFAULT_LAT_LONG reducer invoked");
      return { ...state, location: DEFAULT_LAT_LONG_LOCATION };
    case ADD_DEFAULT_ADDRESS:
      console.log("ADD_DEFAULT_ADDRESS reducer invoked");
      return { ...state, address: DEFAULT_ADDRESS };
    default:
      return state;
  }
};

export default locationReducer;
