import { useAppSelector, useAppDispatch } from "../storeHooks";
import {
  PostMessageOpenerState,
  setPostMessageSheetOpen,
} from "./postMessageSheetOpenerSlice";

export function usePostMessageSheetOpener(): [
  showPostMessageOpener: PostMessageOpenerState,
  setShow: (showPostMessageOpener: PostMessageOpenerState) => void
] {
  const showPostMessageOpener = useAppSelector(
    (state: any) => state.postMessage
  );

  const dispatch = useAppDispatch();

  function setShow(showPostMessageOpener: PostMessageOpenerState) {
    console.log("setShow", showPostMessageOpener);
    dispatch(setPostMessageSheetOpen(showPostMessageOpener));
  }

  return [showPostMessageOpener, setShow];
}
