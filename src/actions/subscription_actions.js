import { ADD_SUBSCRIPTION, CLEAR_SUBSCRIPTION } from "../actions/types";

export const addSubscriptionInformation = (product) => {
    console.log('addSubscriptionInformation action invoked')
  return {
    type: ADD_SUBSCRIPTION,
    payload: product.subscription,
  };
};

export const clearSubscription = () => {
  return {
    type: CLEAR_SUBSCRIPTION,
  };
};
