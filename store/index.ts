import { Action, configureStore } from "@reduxjs/toolkit";
import persistedReducer, { RootState } from "./slices";
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { rootEpic } from "./epics";
import { createEpicMiddleware } from "redux-observable";

const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(epicMiddleware),
  devTools: true,
});

epicMiddleware.run(rootEpic);

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export default store;
