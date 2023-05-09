import { configureStore } from "@reduxjs/toolkit";
import SlideMenuOpenerReducer from "./slideMenuOpener/slideMenuOpenerSlice";

export const reducer = {
  slideMenu: SlideMenuOpenerReducer,
};

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
