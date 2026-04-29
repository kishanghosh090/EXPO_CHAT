import { FriendService } from "@/services/friend.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const USER_KEYS = {
  all: ["users"] as const,
  discover: (search: string) => [...USER_KEYS.all, "discover", search] as const,
  friends: () => [...USER_KEYS.all, "friends"] as const,
};

export function useDiscoverUsers(search: string) {
  return useQuery({
    queryKey: USER_KEYS.discover(search),
    queryFn: () => FriendService.discoverUsers(search),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSendFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => FriendService.sendFriendRequest(userId),
    onMutate: async (reciverId: string) => {
      await queryClient.cancelQueries({ queryKey: USER_KEYS.friends() });
      const previousUsers = queryClient.getQueryData(USER_KEYS.discover(""));
      if (previousUsers) {
        queryClient.setQueryData(USER_KEYS.discover(""), (old: any[]) => {
          if (!old) {
            return [];
          }
          return old.map((user) => {
            if (user.id === reciverId) {
              return {
                ...user,
                relationship: "REQUEST_SENT",
              };
            }
            return user;
          });
        });
      }
    },
  });
}

export function useFriends() {
  return useQuery({
    queryKey: USER_KEYS.friends(),
    queryFn: () => FriendService.getFriends(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
