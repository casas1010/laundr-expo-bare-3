import { ADD_HISTORY } from "../actions/types";

const cartReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_HISTORY:
      console.log("ADD_HISTORY reducer invoked");
      return [...state, ...action.payload];
    default:
      return state;
  }
};

export default cartReducer;
