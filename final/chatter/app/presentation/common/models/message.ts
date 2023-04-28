import ProfileShortModel from "./profile";

export default class MessageModel {
  constructor(
    public id: bigint,
    public updated_at: Date,
    public body: string,
    public likes: number,
    public image: Blob,
    public creator_id: bigint,
    public user_name: string,
    public full_name: string,
    public avatar: Blob,
    public broadcasting_msg?: MessageModel
  ) {}
}
