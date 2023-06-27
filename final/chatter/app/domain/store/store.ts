import { configureStore } from "@reduxjs/toolkit";
import SlideMenuOpenerReducer from "./slideMenuOpener/slideMenuOpenerSlice";
import ProfileReducer from "./profile/profileSlice";

export const reducer = {
  slideMenu: SlideMenuOpenerReducer,
  profile: ProfileReducer,
};

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
