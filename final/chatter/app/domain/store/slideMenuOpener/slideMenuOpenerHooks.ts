import { useAppSelector, useAppDispatch } from "../storeHooks";
import { toggleMenuOpen } from "./slideMenuOpenerSlice";

export function useSlideMenuOpener(): [
  show: boolean,
  setShow: (show: boolean) => void
] {
  const show = useAppSelector((state: any) => state.slideMenuOpener);

  const dispatch = useAppDispatch();
  function setShow(show: boolean) {
    dispatch(toggleMenuOpen(show));
  }

  return [show, setShow];
}
