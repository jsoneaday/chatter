import {
  CIRCLE_MEMBERS_URL,
  CIRCLE_REMOVE_URL,
  CIRCLE_URL,
} from "../utils/api";

export class CircleGroupMember {
  constructor(
    public id: bigint,
    public updatedAt: Date,
    public circleGroupId: bigint,
    public memberId: bigint,
    public userName: string,
    public fullName: string,
    public avatar: Blob
  ) {}
}

type CircleEntityId = {
  id: bigint;
};

export async function addCircleMember(
  circleOwnerId: bigint,
  newMemberId: bigint
) {
  const response = await fetch(CIRCLE_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      circleOwnerId,
      newMemberId,
    }),
  });

  if (response.ok) {
    const entityId: CircleEntityId = await response.json();
    console.log("addCircleMember response", entityId.id);
    return entityId.id;
  } else {
    console.log("addCircleMember error", response.status);
  }
}

export async function removeCircleMember(
  circleGroupId: bigint,
  memberId: bigint
) {
  const response = await fetch(CIRCLE_REMOVE_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      circleGroupId,
      memberId,
    }),
  });

  if (response.ok) {
    console.log("removeCircleMember removed");
  } else {
    console.log("removeCircleMember error", response.status);
  }
}

export async function getCircleGroupByOwner(ownerId: bigint) {
  const response = await fetch(`${CIRCLE_URL}/${ownerId}`);
  if (response.ok) {
    const circleGroupId: CircleEntityId = await response.json();
    console.log("received circleGroupId", circleGroupId.id);
    return circleGroupId.id;
  } else {
    console.log("getCircleGroupByOwner error", response.status);
  }
}

export async function getCircleMembers(circleGroupId: bigint) {
  const response = await fetch(`${CIRCLE_MEMBERS_URL}/${circleGroupId}`);
  if (response.ok) {
    const circleGroupMembers: CircleGroupMember[] = await response.json();
    console.log("getCircleMembers circleGroupMembers", circleGroupMembers);
    return circleGroupMembers;
  } else {
    console.log("getCircleMembers error", response.status);
  }
}
