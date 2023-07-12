import MessageModel from "../../presentation/common/models/message";
import {
  MSGS_URL,
  MSG_IMAGE_URL,
  MSG_RESPONSES_URL,
  MSG_RESPONSE_URL,
  MSG_URL,
} from "../utils/api";
/// @ts-ignore
import { v4 as uuidv4 } from "uuid";

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
  // todo: add optional broadcasting_msg_id
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

  return await fetch(MSG_URL, {
    method: "post",
    body: formData,
  });
}

export async function createMessageResponse(
  userId: bigint,
  body: string,
  groupType: ApiMessageGroupType,
  originalMsgId: bigint,
  uri?: string
) {
  const formData = new FormData();
  formData.append("userId", userId.toString());
  formData.append("body", body.toString());
  formData.append("groupType", groupType.toString());
  formData.append("originalMsgId", originalMsgId.toString());
  if (uri) {
    const ext = uri.substring(uri.lastIndexOf(".") + 1);
    formData.append("image", {
      uri,
      name: "media",
      type: `image/${ext}`,
    } as any);
  }

  return await fetch(MSG_RESPONSE_URL, {
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
    const messages: MessageModel[] = await messageResponse.json();
    return messages;
  }

  return allMessages;
}

export async function getResponseMessages(
  originalMsgId: bigint,
  lastUpdatedAt: string,
  pageSize: number = 10
) {
  console.log("getResponseMessages", originalMsgId, lastUpdatedAt, pageSize);
  // sample: followerId=233&lastUpdatedAt=2023-07-30T14:30:30Z
  const messageResponse = await fetch(MSG_RESPONSES_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      originalMsgId,
      lastUpdatedAt,
      pageSize,
    }),
  });

  let allMessages: MessageModel[] = [];
  if (messageResponse.ok) {
    const messages: MessageModel[] = await messageResponse.json();
    return messages;
  } else {
    console.log("failed getting response messages", messageResponse.status);
  }

  return allMessages;
}
