import { combineReducers } from "redux";
import auth from './auth_reducer'
import cart from './cart_reducer'
import user from './user_reducer'
import history from './history_reducer'
// NOTE: reducer must define an none undefined value... in other words 
// it cant return undefined
export default combineReducers({
  auth,cart,user, history
}); 