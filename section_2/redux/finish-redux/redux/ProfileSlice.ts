import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Profile {
  id: number;
  userName: string;
  fullName: string;
}

export const profileSlice = createSlice({
  name: "profile",
  initialState: null,
  reducers: {
    setUserProfile: (state: any, action: PayloadAction<Profile>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setUserProfile } = profileSlice.actions;
export default profileSlice.reducer;
