import { ADD_HISTORY } from "../actions/types";
import axios from "axios";
import { BASE_URL } from "../key/";

export const fetchOrders = (userEmail) => async (dispatch) => {
  console.log("fetchOrders() action invoked");

  let history;
  try {
    const response = await axios.post(BASE_URL + "/api/order/fetchOrders", {
      filter: "orderHistoryUser",
      filterEmail: userEmail,
    });

    if (response.data.success) {
      history = response.data.message;


      const addStringSearchProperty = (history) => {
        let newData = [];
        history.forEach((item) => {
          item.string = JSON.stringify(item).toLocaleLowerCase();
          newData.push(item);
        });

        return newData;
      };

      history = addStringSearchProperty(history);

      dispatch({
        type: ADD_HISTORY,
        payload: history,
      });
    } else {
      // this.context.showAlert(response.data.message);
      dispatch({
        type: ADD_HISTORY,
        payload: history,
      });
    }
  } catch (error) {
    console.log("error   ", error);
    // return history
    //   showConsoleError("getting orders", error);
    //   this.context.showAlert(caughtError("fetching orders", error, 99));
  }
};

export const fetchHistory = (product) => {
  // perform action
  return {
    type: ADD_HISTORY,
    payload: product,
  };
};
