import { useQuery } from "@tanstack/react-query";
import { AtpAgent } from "@atproto/api";
import ky from "ky";
import type { BackendResponse, FollowerInfo } from "../types";

const agent = new AtpAgent({ service: "https://public.api.bsky.app" });

const BACKEND_URL =
	"https://tylersayshi--7a77153cbaba11f08a7c0224a6c84d84.web.val.run/";

export function useBlueskyFollows(handle: string | null) {
	return useQuery({
		queryKey: ["bsky-follows", handle],
		queryFn: async () => {
			if (!handle) throw new Error("No handle provided");

			const result = await ky
				.get(BACKEND_URL, {
					searchParams: { actor: handle },
				})
				.json<BackendResponse>();

			// Pre-compute Sets and Maps for performance
			const followsSet = new Set(result.follows.map((f) => f.handle));
			const followersSet = new Set(result.followers.map((f) => f.handle));

			// Combine all unique accounts
			const allAccounts = new Map<string, FollowerInfo>();
			for (const account of result.follows) {
				allAccounts.set(account.handle, account);
			}
			for (const account of result.followers) {
				allAccounts.set(account.handle, account);
			}

			return {
				...result,
				followsSet,
				followersSet,
				allAccounts,
			};
		},
		enabled: !!handle,
	});
}

export function useSearchActors(query: string) {
	return useQuery({
		queryKey: ["search-actors", query],
		queryFn: async () => {
			if (!query || query.length < 2) return [];

			const response = await agent.app.bsky.actor.searchActorsTypeahead({
				q: query,
				limit: 10,
			});

			return response.data.actors;
		},
		enabled: query.length >= 2,
		staleTime: 1000 * 60, // 1 minute
	});
}
