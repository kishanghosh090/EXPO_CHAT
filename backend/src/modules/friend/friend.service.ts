import type { User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

function normalizePair(user1: string, user2: string): [string, string] {
  return user1 < user2 ? [user1, user2] : [user2, user1];
}
export async function discoverUsers(
  userId: string,
  search: string = "",
): Promise<Pick<User, "id" | "name" | "email" | "image">[] | []> {
  const q = search.trim();

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },
      ...(q
        ? {
            OR: [
              {
                name: {
                  contains: q,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: q,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });
  if (users.length == 0) {
    return [];
  }
  const ids = users.map((u) => u.id);
  const friendsPairs = ids.map((otherId) => {
    const [user1, user2] = normalizePair(userId, otherId);
    return { userId1: user1, userId2: user2 };
  });

  const [friends, outgoingRequests, incomingRequests] = await Promise.all([
    prisma.friend.findMany({
      where: {
        OR: friendsPairs,
      },
      select: {
        userId1: true,
        userId2: true,
      },
    }),
    prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        receiverId: {
          in: ids,
        },
        status: "PENDING",
      },
      select: {
        receiverId: true,
        id: true,
      },
    }),
    prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        senderId: {
          in: ids,
        },
        status: "PENDING",
      },
      select: {
        senderId: true,
        id: true,
      },
    }),
  ]);

  const friendsSet = new Set(
    friends.map((f) => {
      const [user1, user2] = normalizePair(f.userId1, f.userId2);
      return `${user1}-${user2}`;
    }),
  );
  const outgoingSet = new Set(
    outgoingRequests.map((r) => {
      return r.receiverId;
    }),
  );
  const incomingSet = new Set(incomingRequests.map((r) => r.senderId));

  return users.map((u) => {
    const [user1, user2] = normalizePair(userId, u.id);
    const key = `${user1}-${user2}`;

    let relationship = "none";
    let friendRequestId: string | null = null;

    if (friendsSet.has(key)) {
      relationship = "friend";
    } else if (outgoingSet.has(u.id)) {
      relationship = "REQUEST_SENT";
      const request = outgoingRequests.find((r) => r.receiverId === u.id);
      friendRequestId = request ? request.id : null;
    } else if (incomingSet.has(u.id)) {
      relationship = "REQUEST_RECEIVED";
      const request = incomingRequests.find((r) => r.senderId === u.id);
      friendRequestId = request ? request.id : null;
    }
    return {
      ...u,
      relationship,
      friendRequestId,
    };
  });
}

export async function friendsDetailed(
  userId: string,
): Promise<Pick<User, "id" | "name" | "email" | "image">[] | []> {
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
