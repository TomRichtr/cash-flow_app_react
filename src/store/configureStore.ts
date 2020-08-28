import { createStore, applyMiddleware, combineReducers } from "redux";
import filtersReducer from "../reducers/filters";
import transactionsReducer from "../reducers/transactions";
import authsReducer from "../reducers/auth";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import localForage from "localforage";
import { TransactionsState, FiltersState, LogState } from "../actions";

const persistConfig = {
  key: "root13",
  storage: localForage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    transactionsReducer,
    filtersReducer,
    authsReducer,
  })
);

export const store = createStore(
  persistedReducer as any,
  composeWithDevTools(applyMiddleware())
);

export const persistor = persistStore(store);

export type RootState = {
  transactionsReducer: TransactionsState[];
  filtersReducer: FiltersState;
  authsReducer: LogState;
};
