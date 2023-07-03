import Profile from "../../entities/profile";
import { useAppDispatch, useAppSelector } from "../storeHooks";
import { setUserProfile } from "./profileSlice";

export function useProfile(): [
  profile: Profile | undefined,
  setProfile: (profile: Profile) => void
] {
  const profile = useAppSelector((state: any) => state.profile);

  const dispatch = useAppDispatch();

  function setProfile(profile: Profile) {
    console.log("dispatch profile", profile);
    dispatch(setUserProfile(profile));
  }

  return [profile, setProfile];
}
