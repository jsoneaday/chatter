import { useAppSelector, useAppDispatch } from "../storeHooks";
import { setPostMessageSheetOpen } from "./postMessageSheetOpenerSlice";

export function usePostMessageSheetOpener(): [
  show: boolean,
  setShow: (show: boolean) => void
] {
  const show = useAppSelector((state: any) => state.postMessage);

  const dispatch = useAppDispatch();

  function setShow(show: boolean) {
    console.log("dispatch show", show);
    dispatch(setPostMessageSheetOpen(show));
  }

  return [show, setShow];
}
