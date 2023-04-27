export default class MessageEntity {
  constructor(
    id: number,
    user_id: number,
    body: string,
    likes: number,
    updated_at?: Date,
    image?: Blob
  ) {}
}
