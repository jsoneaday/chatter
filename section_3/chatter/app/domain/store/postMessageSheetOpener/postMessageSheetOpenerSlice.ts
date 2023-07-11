import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum TypeOfPost {
  NewPost,
  Response,
  Resend,
}

export type PostMessageOpenerState = {
  show: boolean;
  typeOfPost: TypeOfPost;
  broadcastingMsgOrOriginalMsgId?: bigint;
};

let initialState: PostMessageOpenerState = {
  show: false,
  typeOfPost: TypeOfPost.NewPost,
};

export const postMessageSheetOpenerSlice = createSlice({
  name: "postMessageSheetOpener",
  initialState,
  reducers: {
    setPostMessageSheetOpen: (
      state: any,
      action: PayloadAction<PostMessageOpenerState>
    ) => {
      state = action.payload;
      console.log("setPostMessageSheetOpen", state);
      return state;
    },
  },
});

export const { setPostMessageSheetOpen } = postMessageSheetOpenerSlice.actions;
export default postMessageSheetOpenerSlice.reducer;
