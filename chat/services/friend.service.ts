import { authClient } from "@/utils/auth-client";

const API_URL = "http://192.168.1.8:4005/api/v1";

async function getHeaders() {
  const cookie = (await authClient.getCookie()) ?? "";
  return {
    "Content-Type": "application/json",
    ...(cookie ? { Cookie: cookie } : {}),
  };
}

export class FriendService {
  static async getFriends() {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/friend/list`, {
      method: "GET",
      headers,
    });

    const data = await response.clone().json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch friends");
    }
    return data;
  }

  static async discoverUsers(search: string) {
    const headers = await getHeaders();
    const response = await fetch(
      `${API_URL}/friend/discover?search=${encodeURIComponent(search)}`,
      {
        method: "GET",
        headers,
      },
    );

    try {
      const data = await response.clone().json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to discover users");
      }
      console.log(data.data);
      
      return data.data;
    } catch (error) {
      throw new Error("Failed to discover users");
    }
  }

  static async sendFriendRequest(reciverId: string) {
    const headers = await getHeaders();
    console.log(headers);
    
    const response = await fetch(`${API_URL}/friend/request`, {
      method: "POST",
      headers,
      body: JSON.stringify({ reciverId }),
    });

    const data = await response.clone().json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to send friend request");
    }
    return data;
  }
}
