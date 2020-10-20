import { ADD_SUBSCRIPTION, CLEAR_SUBSCRIPTION } from "../actions/types";

const SAMPLE_SUBSCRIPTION = {
  _id: "",
  anchorDate: "",
  id: "",
  lbsLeft: 0,
  periodEnd: "",
  periodStart: "",
  plan: "",
  startDate: "",
  status: "",
};

const subscriptionReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_SUBSCRIPTION:
      console.log("ADD_SUBSCRIPTION reducer invoked");
      console.log("subscription data:  ", action.payload);
      return {...action.payload};
    case CLEAR_SUBSCRIPTION:
      console.log("CLEAR_SUBSCRIPTION reducer invoked");
      return {};
    default:
      return state;
  }
};

export default subscriptionReducer;
