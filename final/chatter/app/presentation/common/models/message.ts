import ProfileShortModel from "./profile";

export default class MessageModel {
  constructor(
    public id: number,
    public created_at: Date,
    public body: string,
    public likes: number,
    public image: Blob,
    public profile: ProfileShortModel,
    public broadcasting_msg?: MessageModel
  ) {}
}
