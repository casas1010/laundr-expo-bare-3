import {REMOVE_FROM_CART, ADD_TO_CART} from '../actions/types';


export const addItemToCart = (product) => {
  // perform action
  return {
    type: ADD_TO_CART,
    payload: product,
  };
};


export const removeItemFromCart = (product) => {
  // perform action
  return {
    type: REMOVE_FROM_CART,
    payload: product,
  };
};
