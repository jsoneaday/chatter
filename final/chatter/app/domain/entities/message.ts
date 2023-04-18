export default class Message {
  constructor(
    userName: string,
    fullName: string,
    timeStamp: Date,
    body: string,
    repeatId: string,
    likeCount: number,
    responseIds: string[],
    rechatIds: string[],
    pic?: string
  ) {}
}
