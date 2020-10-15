import {
  ADD_USER_INFORMATION,
  REMOVE_USER_INFORMATION,
  ADD_USER_LAT_LONG,
  ADD_USER_ADDRESS,
  CLEAR_DATA,
  GET_CARD_DETAILS,
} from "../actions/types";

/*
DATA SAMPLE
const userData = {
  __v: 0,
  _id: "5ed3503612101f55ec36a254",
  city: "Gainesville",
  email: "u1@gmail.com",
  fname: "User",
  iat: 1602605480,
  isAdmin: false,
  isDriver: false,
  isWasher: false,
  lname: "One",
  phone: "1111111111",
  stripe: {
    customerID: "cus_HNVnKreHoaWvzt",
    regPaymentID: "pm_1HK9jeCmyk9ubtk6TFdHASKC",
  },
  subscription: {
    _id: "5ed9fd8a840f485f984ba1f3",
    anchorDate: "2020-06-05T04:08:36-04:00",
    id: "sub_HPPQcwu8O9SEuN",
    lbsLeft: 0,
    periodEnd: "2020-07-05T04:08:36-04:00",
    periodStart: "2020-06-05T04:08:36-04:00",
    plan: "Plus",
    startDate: "2020-06-05T04:08:36-04:00",
    status: "cancelled",
  },
  usedReferral: "",

  // these to properties are added by the phone to find the users location in homepage
  location: {
    latitude: null,
    longitude: null,
  },
  address: null,
};


*/

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

const userReducer = (state = userData, action) => {
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

    case GET_CARD_DETAILS:
      console.log("GET_CARD_DETAILS reducer invoked");
      // console.log("state:  ", state);
      // console.log("cardInfo:  ", action.payload);
      return { ...state, cardInfo: action.payload };
    default:
      return state;
  }
};

export default userReducer;
