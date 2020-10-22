import { GET_CARD_DETAILS } from "../actions/types";

const PAYMENT_DETAILS = {
  cardInfo: {
    brand: '', 
    expMonth: '', 
    expYear: '', 
    lastFour: '', 
    regPaymentID: '',
    customerID: '',
  },
};

const paymentReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CARD_DETAILS:
      console.log("GET_CARD_DETAILS reducer invoked");
      // console.log("state:  ", state);
     
      console.log("cardInfo:  ", action.payload);
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default paymentReducer;
