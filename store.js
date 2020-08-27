import ExpoFileSystemStorage from "redux-persist-expo-filesystem"
//import autoMergel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'
import { createStore, applyMiddleware} from "redux";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import rootReducer from "./reducers";

//middleware for persistent storage
const persistConfig = {
  key: "root",
  storage: ExpoFileSystemStorage,
  whitelist: ["saveComponents", "currentUser", "miscData"],
  blacklist: ["basicComponents"],
  keyPrefix: '',
  //stateReconciler: autoMergel1,
  //version: 1
};


const persistentReducer = persistReducer(persistConfig, rootReducer);

const DEBUG = false;

const middlewares = [DEBUG && createLogger()].filter(Boolean);
const store = createStore(persistentReducer,{}, applyMiddleware(...middlewares));
const persistor = persistStore(store);
export default {
  store,
  persistor
};
