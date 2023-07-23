import { Profile, setUserProfile } from "./ProfileSlice";
import { useAppDispatch, useAppSelector } from "./StoreHooks";

export function useProfile(): [
  profile: Profile | undefined,
  setProfile: (profile: Profile) => void
] {
  const profile = useAppSelector((state: any) => state.profile);

  const dispatch = useAppDispatch();

  const setProfile = (profile: Profile) => {
    dispatch(setUserProfile(profile));
  };

  return [profile, setProfile];
}
