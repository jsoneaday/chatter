import { configureStore } from "@reduxjs/toolkit";
import SlideMenuOpenerReducer from "./slideMenuOpener/slideMenuOpenerSlice";
import ProfileReducer from "./profile/profileSlice";
import PostMessageReducer from "./postMessageSheetOpener/postMessageSheetOpenerSlice";

export const reducer = {
  slideMenu: SlideMenuOpenerReducer,
  profile: ProfileReducer,
  postMessage: PostMessageReducer,
};

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
