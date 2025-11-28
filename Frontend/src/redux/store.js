// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./authSlice";

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

// export default store;


import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
});

// Just export store, handle persistor in main.jsx differently
export default store;

// Manual persistence (simpler approach)
if (typeof window !== 'undefined') {
  persistStore(store);
}