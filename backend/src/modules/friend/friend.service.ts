import type { User } from "../../../generated/prisma/client";

export async function discoverUsers(
  userId: string,
  search: string = "",
): Promise<User[] | []> {
  // Implementation for discovering users
  return [];
}

export async function friendsDetailed(userId: string): Promise<User[] | []> {
  // Implementation for listing friends with details
  return [];
}

export async function sendRequestToFriend(
  senderId: string,
  recipientId: string,
): Promise<boolean | null> {
  // Implementation for sending friend request
  return true;
}
