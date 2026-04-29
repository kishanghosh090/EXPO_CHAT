import type { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import {
  discoverUsers,
  friendsDetailed,
  sendRequestToFriend,
} from "./friend.service";

type AuthenticatedRequest = Request & {
  user?: {
    id?: string;
  };
};

export async function sendRequest(req: AuthenticatedRequest, res: Response) {
  try {
    const senderId = req.user?.id;
    const { recipientId } = req.body;

    if (!senderId) {
      return res.status(400).json(new ApiResponse(401, "Unauthorized"));
    }

    if (!recipientId || typeof recipientId !== "string") {
      return res
        .status(400)
        .json(new ApiError(400, "Recipient ID is required"));
    }

    // Implementation for sending friend request
    const result = await sendRequestToFriend(senderId, recipientId);

    if (result == null) {
      return res
        .status(400)
        .json(new ApiError(400, "Failed to send friend request"));
    }
    //TODO: PUSH NOTIFICATION LATER

    return res.status(200).json(new ApiResponse(200, null, "Request sent"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
}

export async function listFriends(req: AuthenticatedRequest, res: Response) {
  try {
    const userID = req.user?.id;

    if (!userID) {
      return res.status(400).json(new ApiResponse(401, "Unauthorized"));
    }

    // Implementation for listing friends
    const data = await friendsDetailed(userID);
    return res.status(200).json(new ApiResponse(200, data, "Success"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
}

export async function discoverFriends(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.user?.id;
    const search = req.query.search;

    if (!userId) {
      return res.status(400).json(new ApiResponse(401, "Unauthorized"));
    }

    if (!search || typeof search !== "string" || search.trim() === "") {
      return res
        .status(400)
        .json(new ApiResponse(400, "Search query is required"));
    }
    const data = await discoverUsers(userId, search);

    return res.status(200).json(new ApiResponse(200, data, "Success"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
}
