import { combineReducers } from "redux";
import auth from "./auth_reducer";
import cart from "./cart_reducer";
import user from "./user_reducer";
import history from "./history_reducer";
import payment from "./payment_reducer";
import location from "./location_reducer";
import subscription from "./subscription_reducer";
// NOTE: reducer must define an none undefined value... in other words
// it cant return undefined
export default combineReducers({
  auth,
  cart,
  user,
  history,
  payment,
  location,
  subscription,
});
