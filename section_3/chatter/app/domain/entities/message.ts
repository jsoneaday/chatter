import MessageModel from "../../presentation/common/models/message";
import { MSGS_URL, MSG_IMAGE_URL, MSG_URL } from "../utils/api";

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

export enum ApiMessageGroupType {
  Public = 1,
  Circle = 2,
}

export async function createMessage(
  userId: bigint,
  body: string,
  groupType: ApiMessageGroupType,
  uri?: string
) {
  const formData = new FormData();
  formData.append("userId", userId.toString());
  formData.append("body", body.toString());
  formData.append("groupType", groupType.toString());
  if (uri) {
    const ext = uri.substring(uri.lastIndexOf(".") + 1);
    formData.append("image", {
      uri,
      name: "media",
      type: `image/${ext}`,
    } as any);
  }
  console.log("createMessage uri", uri);
  return await fetch(MSG_URL, {
    method: "post",
    body: formData,
  });
}

export async function getMessagesByFollower(
  followerId: bigint,
  lastUpdatedAt: string,
  pageSize: number = 10
) {
  // sample: followerId=233&lastUpdatedAt=2023-07-30T14:30:30Z
  const messageResponse = await fetch(MSGS_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      followerId,
      lastUpdatedAt,
      pageSize,
    }),
  });

  let allMessages: MessageModel[] = [];
  if (messageResponse.ok) {
    const messages = await messageResponse.json();
    messages.forEach(async (msg: MessageModel) => {
      const imageResponse = await fetch(`${MSG_IMAGE_URL}/${msg.id}`, {
        method: "get",
      });
      if (imageResponse.ok) {
        const image = await imageResponse.blob();
        if (image) {
          msg.image = image;
        }
      }
    });
    allMessages = [...allMessages, ...messages];
  }

  return allMessages;
}
