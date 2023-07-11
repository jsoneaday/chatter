import { createSlice, PayloadAction } from "@reduxjs/toolkit";

let initialState: boolean = false;

export const postMessageSheetOpenerSlice = createSlice({
  name: "postMessageSheetOpener",
  initialState,
  reducers: {
    setPostMessageSheetOpen: (state: any, action: PayloadAction<boolean>) => {
      state = action.payload;
      console.log("postMessageSheetOpener state", state);
      return state;
    },
  },
});

export const { setPostMessageSheetOpen } = postMessageSheetOpenerSlice.actions;
export default postMessageSheetOpenerSlice.reducer;
