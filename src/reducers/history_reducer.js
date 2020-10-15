import { ADD_HISTORY,CLEAR_HISTORY } from "../actions/types";

const cartReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_HISTORY:
      console.log("ADD_HISTORY reducer invoked");
      return [...state, ...action.payload];
    case CLEAR_HISTORY:
      console.log("CLEAR_HISTORY reducer invoked");
      return []
    default:
      return state;
  }
};

export default cartReducer;
