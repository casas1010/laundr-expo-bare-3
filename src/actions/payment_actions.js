import { GET_CARD_DETAILS } from "../actions/types";
import * as Location from "expo-location";
import { GOOGLE_MAPS_KEY, BASE_URL } from "../key";
import axios from "axios";

export const fetchPaymentInfo = (data) => async (dispatch) => {
  let localData = {
    customerID: data.stripe.customerID,
    regPaymentID: data.stripe.regPaymentID,
  };

  console.log("fetchPaymentInfo() action invoked");
  let cardInfo = {
    brand: "",
    expMonth: "",
    expYear: "",
    lastFour: "",
  };

  try {
    const response = await axios.post(BASE_URL + "/api/stripe/getCardDetails", {
      paymentID: localData.regPaymentID,
    });

    if (response.data.success) {
      const card = response.data.message.card;

      cardInfo = {
        brand: card.brand.toUpperCase(),
        expMonth: card.exp_month,
        expYear: card.exp_year,
        lastFour: card.last4,
      };

      // return { type: GET_CARD_DETAILS, payload: cardInfo}
      dispatch({
        type: GET_CARD_DETAILS,
        payload: { ...cardInfo, ...localData },
      });
    } else {
      // return { type: GET_CARD_DETAILS, payload: cardInfo}
      dispatch({ type: GET_CARD_DETAILS, payload: cardInfo });
    }
  } catch (error) {
    console.log("error");
    console.log(error);
    // return { type: GET_CARD_DETAILS, payload: cardInfo}
    dispatch({ type: GET_CARD_DETAILS, payload: cardInfo });
  }
};
