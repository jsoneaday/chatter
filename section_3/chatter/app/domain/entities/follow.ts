import { FOLLOW_URL } from "../utils/api";

export default class FollowEntity {
  constructor(
    id: bigint,
    created_at: Date,
    followerId: number,
    followingId: number
  ) {}
}

export async function getFollowers(followingId: bigint) {
  return await fetch(`${FOLLOW_URL}/${followingId}`, {
    method: "get",
  });
}
