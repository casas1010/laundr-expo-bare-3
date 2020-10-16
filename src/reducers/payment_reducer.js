import { GET_CARD_DETAILS } from "../actions/types";

const PAYMENT_DETAILS = {
  cardInfo: {
    brand: null,
    customerID: null,
    expMonth: null,
    expYear: null,
    lastFour: null,
    regPaymentID: null,
  },
};

const paymentReducer = (state = PAYMENT_DETAILS, action) => {
  switch (action.type) {
    case GET_CARD_DETAILS:
      console.log("GET_CARD_DETAILS reducer invoked");
      // console.log("state:  ", state);
      console.log("cardInfo:  ", action.payload);
      return { ...state, cardInfo: action.payload };
    default:
      return state;
  }
};

export default paymentReducer;
