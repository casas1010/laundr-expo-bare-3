import {
  ADD_USER_LAT_LONG,
  ADD_USER_ADDRESS,
} from "../actions/types";


const userReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_USER_LAT_LONG:
      console.log("ADD_USER_LAT_LONG reducer invoked");
      // console.log("action.payload:  ", action.payload);
      return { ...state, location: action.payload };
    case ADD_USER_ADDRESS:
      console.log("ADD_USER_ADDRESS reducer invoked");
      // console.log("action.payload:  ", action.payload);
      return { ...state, address: action.payload };

    default:
      return state;
  }
};

export default userReducer;
