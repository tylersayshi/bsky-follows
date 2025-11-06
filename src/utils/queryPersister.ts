import type {
	PersistedClient,
	Persister,
} from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";

const QUERY_CACHE_KEY = "bsky-query-cache";

/**
 * Custom persister for TanStack Query that only persists bsky-follows queries
 * when willCache is false (meaning the server won't cache this data)
 */
export function createIDBPersister(): Persister {
	return {
		persistClient: async (client: PersistedClient) => {
			try {
				// Filter to only persist bsky-follows queries where willCache is false
				const filteredQueries = client.clientState.queries.filter((query) => {
					const queryKey = query.queryKey;

					// Only persist bsky-follows queries
					if (!Array.isArray(queryKey) || queryKey[0] !== "bsky-follows") {
						return false;
					}

					// Check if this query has willCache: false in its state
					const queryState = query.state;
					if (queryState?.data && typeof queryState.data === "object") {
						const data = queryState.data as { willCache: boolean };
						// Only persist if willCache is false (server won't cache it)
						return data.willCache === false;
					}

					return false;
				});

				// Create a new client state with only the filtered queries
				const filteredClient: PersistedClient = {
					...client,
					clientState: {
						...client.clientState,
						queries: filteredQueries,
					},
				};

				await set(QUERY_CACHE_KEY, filteredClient);
			} catch (error) {
				console.error("Failed to persist query cache:", error);
			}
		},

		restoreClient: async () => {
			try {
				const client = await get<PersistedClient>(QUERY_CACHE_KEY);
				return client;
			} catch (error) {
				console.error("Failed to restore query cache:", error);
				return undefined;
			}
		},

		removeClient: async () => {
			try {
				await del(QUERY_CACHE_KEY);
			} catch (error) {
				console.error("Failed to remove query cache:", error);
			}
		},
	};
}
