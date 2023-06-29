export default class ProfileShortModel {
  constructor(
    public id: bigint,
    public created_at: Date,
    public user_name: string,
    public full_name: string,
    public avatar: Blob
  ) {}
}
