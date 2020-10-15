import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist"; 
import { AsyncStorage } from "react-native";
import rootReducer from "../reducers";

// import { createLogger } from "redux-logger";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["cart","user","history"],
};

const persitedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persitedReducer, //reducers
  {}, //default state
  compose(applyMiddleware(thunk, 
    // createLogger()
    ))
);
export default store;
