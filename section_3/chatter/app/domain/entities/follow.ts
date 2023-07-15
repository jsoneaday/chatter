import { FOLLOW_URL } from "../utils/api";

export default class FollowEntity {
  constructor(
    id: bigint,
    created_at: Date,
    followerId: number,
    followingId: number
  ) {}
}

export interface Follower {
  id: bigint;
  createdAt: Date;
  userName: string;
  fullName: string;
  description: string;
  region?: string;
  mainUrl?: string;
  avatar?: Blob;
}

export async function getFollowers(followingId: bigint) {
  const result = await fetch(`${FOLLOW_URL}/${followingId}`, {
    method: "get",
  });

  if (result.ok) {
    const followers: Follower[] = await result.json();
    return followers;
  }
  return [];
}
