import { createSlice, PayloadAction } from "@reduxjs/toolkit";

let initialState: boolean = false;

export const slideMenuOpenerSlice = createSlice({
  name: "slideMenuOpener",
  initialState,
  reducers: {
    toggleMenuOpen: (state: any, action: PayloadAction<boolean>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { toggleMenuOpen } = slideMenuOpenerSlice.actions;
export default slideMenuOpenerSlice.reducer;
