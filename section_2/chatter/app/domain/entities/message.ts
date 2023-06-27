export default class MessageEntity {
  constructor(
    id: bigint,
    user_id: bigint,
    body: string,
    likes: number,
    updated_at?: Date,
    image?: Blob
  ) {}
}
