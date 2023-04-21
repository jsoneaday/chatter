import Follow from "./follow";

export default class Profile {
  constructor(
    id: string,
    userName: string,
    fullName: string,
    updatedAt: Date,
    description: string,
    avatar: Blob,
    following: Follow[],
    followers: Follow[]
  ) {}
}
