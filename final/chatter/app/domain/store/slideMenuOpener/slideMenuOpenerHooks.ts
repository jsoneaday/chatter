import { useAppSelector, useAppDispatch } from "../storeHooks";
import { setMenuOpen } from "./slideMenuOpenerSlice";

export function useSlideMenuOpener(): [
  show: boolean,
  setShow: (show: boolean) => void
] {
  const show = useAppSelector((state: any) => state.slideMenu);

  const dispatch = useAppDispatch();

  function setShow(show: boolean) {
    console.log("dispatch show", show);
    dispatch(setMenuOpen(show));
  }

  return [show, setShow];
}
