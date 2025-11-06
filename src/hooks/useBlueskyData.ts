import { useQuery } from "@tanstack/react-query";
import { AtpAgent } from "@atproto/api";
import { HTTPError } from "ky";
import ky from "ky";
import type {
	BackendResponse,
	BackendErrorResponse,
	FollowerInfo,
} from "../types";

const agent = new AtpAgent({ service: "https://public.api.bsky.app" });

const BACKEND_URL =
	"https://tylersayshi--7a77153cbaba11f08a7c0224a6c84d84.web.val.run/";

export function useBlueskyFollows(handle: string | null) {
	return useQuery({
		queryKey: ["bsky-follows", handle],
		queryFn: async () => {
			if (!handle) throw new Error("No handle provided");

			try {
				const result = await ky
					.get(BACKEND_URL, {
						searchParams: { actor: handle },
						timeout: 60000 * 5, // 5 mins
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
			} catch (error) {
				if (error instanceof HTTPError) {
					const errorData = await error.response.json<BackendErrorResponse>();
					throw new Error(
						errorData.error || errorData.message || "Failed to fetch data",
					);
				}
				throw error;
			}
		},
		enabled: !!handle,
		retry: false,
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

export function useBlueskyProfile(handle: string | null) {
	return useQuery({
		queryKey: ["bsky-profile", handle],
		queryFn: async () => {
			if (!handle) throw new Error("No handle provided");

			const response = await agent.app.bsky.actor.getProfile({
				actor: handle,
			});

			return {
				handle: response.data.handle,
				displayName: response.data.displayName || response.data.handle,
				avatar: response.data.avatar,
				description: response.data.description,
			};
		},
		enabled: !!handle,
		staleTime: 1000 * 60 * 5, // 5 minutes
		retry: false,
	});
}
