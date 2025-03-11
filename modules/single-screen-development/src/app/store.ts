import { configureStore } from "@reduxjs/toolkit";
import reducer from "../redux/exhibitScreensSlice";
import containerInfoReducer from "../redux/containerInfoSlice";

export const store = configureStore({
  reducer: {
    exhibitScreens: reducer,
    containerInfo: containerInfoReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
