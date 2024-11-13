import { configureStore } from "@reduxjs/toolkit";
import reducer from "../redux/exhibitScreensSlice";

export const store = configureStore({
  reducer: {
    exhibitScreens: reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
