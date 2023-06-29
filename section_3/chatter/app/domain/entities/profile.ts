import { PROFILE_URL } from "../utils/api";
import { headers } from "../utils/fetchHeaders";
import FollowEntity from "./follow";

export default class Profile {
  constructor(
    id: bigint,
    createdAt: Date,
    userName: string,
    fullName: string,
    description: string,
    region: string,
    mainUrl: string,
    avatar: Blob,
    following: FollowEntity[],
    followers: FollowEntity[]
  ) {}
}

export class NewProfile {
  constructor(
    userName: string,
    fullName: string,
    description: string,
    region: string,
    mainUrl: string,
    avatar: Blob
  ) {}
}

export async function createProfile(profile: NewProfile) {
  await fetch(`${PROFILE_URL}`, {
    method: "post",
    headers,
    body: JSON.stringify(profile),
  });
}

export async function getProfile(userName: string) {
  await fetch(`${PROFILE_URL}/${userName}`, {
    method: "get",
    headers,
  });
}
