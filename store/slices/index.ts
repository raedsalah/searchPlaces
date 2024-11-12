import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import searchReducer from "./searchSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["search"],
};

const rootReducer = combineReducers({
  search: searchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export type RootState = ReturnType<typeof rootReducer>;

export default persistedReducer;
