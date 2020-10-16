import {
  ADD_USER_INFORMATION,
  REMOVE_USER_INFORMATION,
  ADD_USER_LAT_LONG,
  ADD_USER_ADDRESS,
  CLEAR_DATA,
} from "../actions/types";

const userData = {
  __v: undefined,
  _id: "",
  city: "",
  email: "",
  fname: "",
  iat: undefined,
  isAdmin: false,
  isDriver: false,
  isWasher: false,
  lname: "",
  phone: "",
  stripe: {
    customerID: "",
    regPaymentID: "",
  },
  subscription: {
    _id: "",
    anchorDate: "",
    id: "",
    lbsLeft: 0,
    periodEnd: "",
    periodStart: "",
    plan: "",
    startDate: "",
    status: "",
  },
  usedReferral: "",

  // these to properties are added by the phone to find the users location in homepage
  location: {
    latitude: null,
    longitude: null,
  },

  // these properties are added by the stripe API call
  address: null,
  cardInfo: {
    brand: "",
    expMonth: "",
    expYear: "",
    lastFour: "",
  },
};

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_USER_INFORMATION:
      console.log("ADD_USER_INFORMATION reducer invoked");
      // console.log("state:  ", state);
      console.log("action.payload:  ", action.payload);
      return {
        ...action.payload,
        location: state.location,
        address: state.address,
      };
    case REMOVE_USER_INFORMATION:
      return state.filter((cartItem) => cartItem.id !== action.payload.id);

    case ADD_USER_LAT_LONG:
      console.log("ADD_USER_LAT_LONG reducer invoked");
      // console.log("action.payload:  ", action.payload);
      return { ...state, location: action.payload };

    case ADD_USER_ADDRESS:
      console.log("ADD_USER_ADDRESS reducer invoked");
      // console.log("action.payload:  ", action.payload);
      return { ...state, address: action.payload };
    case CLEAR_DATA:
      console.log("CLEAR_DATA reducer invoked");
      return {};

    default:
      return state;
  }
};

export default userReducer;
