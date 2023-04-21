export default class Message {
  constructor(
    id: string,
    userName: string,
    fullName: string,
    updatedAt: Date,
    body: string,
    likes: number,
    broadcastingMsg?: Message,
    respondingMsg?: Message,
    image?: Blob
  ) {}
}
