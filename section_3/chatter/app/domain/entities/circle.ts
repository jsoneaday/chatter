import { CIRCLE_URL } from "../utils/api";

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
    return await response.json();
  } else {
    console.log("addCircleMember error", response.status);
  }
}

export async function removeCircleMember(
  circleGroupId: bigint,
  memberId: bigint
) {
  const response = await fetch(`${CIRCLE_URL}/${circleGroupId}/${memberId}`, {
    method: "delete",
  });

  if (response.ok) {
    return await response.json();
  } else {
    console.log("addCircleMember error", response.status);
  }
}
