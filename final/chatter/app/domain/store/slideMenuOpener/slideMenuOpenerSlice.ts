import { createSlice, PayloadAction } from "@reduxjs/toolkit";

let initialState: boolean = false;

export const slideMenuOpenerSlice = createSlice({
  name: "slideMenuOpener",
  initialState,
  reducers: {
    setMenuOpen: (state: any, action: PayloadAction<boolean>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setMenuOpen } = slideMenuOpenerSlice.actions;
export default slideMenuOpenerSlice.reducer;
