import { useDeferredValue } from "react";
import { FollowersVennDiagram } from "./FollowersVennDiagram";
import { AccountsList } from "./AccountsList";
import type { FollowerInfo } from "../types";
import { useFilters } from "../hooks/useFilters";
import { getFilteredAccounts } from "../utils/comparison";
import { useSuspendedBlueskyFollows } from "../hooks/useBlueskyData";

interface UnifiedResultsViewProps {
	allAccountsMap: Map<string, FollowerInfo>;
}

export function UnifiedResultsView({
	allAccountsMap,
}: UnifiedResultsViewProps) {
	const [state] = useFilters();
	const {
		data: userAData,
	} = useSuspendedBlueskyFollows(state.a);
	const {
		data: userBData,
	} = useSuspendedBlueskyFollows(state.b);

	// Defer the selected sets so UI updates immediately but filtering happens in background
	const deferredSelectedSets = useDeferredValue(state.selectedSets);

	// Map stable keys to actual Set objects
	const keyToSetMap = new Map<string, Set<string>>([
		['user1-followers', userAData.followersSet],
		['user2-followers', userBData.followersSet],
		['user1-following', userAData.followsSet],
		['user2-following', userBData.followsSet],
	]);

	// Filter accounts based on selected sets using optimized Set intersection
	const filteredAccounts = (() => {
		if (deferredSelectedSets.length === 0) return [];

		// Get all the sets that were selected using stable keys
		const selectedSets = deferredSelectedSets
			.map((key) => keyToSetMap.get(key))
			.filter((set): set is Set<string> => set !== undefined);

		return getFilteredAccounts(selectedSets, allAccountsMap);
	})();

	const isFiltering = state.selectedSets !== deferredSelectedSets;

	return (
		<div className="space-y-6 flex-col flex md:flex-row-reverse">
			{/* Similarity Score */}
			{/* <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Similarity Score</div>
        <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{similarityScore} / 100</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {message}
        </div>
      </div> */}

			{/* Venn Diagram */}
			<FollowersVennDiagram
				user1Followers={userAData.followersSet}
				user2Followers={userBData.followersSet}
				user1Following={userAData.followsSet}
				user2Following={userBData.followsSet}
			/>

			{/* Accounts List */}
			<div
				className="w-full"
				style={{
					opacity: isFiltering ? 0.6 : 1,
					transition: "opacity 0.2s",
				}}
			>
				<h2
					className="text-lg font-semibold mb-4"
					style={{ color: "var(--text-primary)" }}
				>
					Results{" "}
					<span className="text-cyan-600">({filteredAccounts.length})</span>
				</h2>
				<AccountsList accounts={filteredAccounts} />
			</div>
		</div>
	);
}
