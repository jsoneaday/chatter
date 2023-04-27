import FollowEntity from "./follow";

export default class Profile {
  constructor(
    id: number,
    created_at: Date,
    user_name: string,
    full_name: string,
    description: string,
    region: string,
    main_url: string,
    avatar: Blob,
    following: FollowEntity[],
    followers: FollowEntity[]
  ) {}
}
