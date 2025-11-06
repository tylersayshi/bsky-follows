import type { BackendResponse, FollowerInfo } from "../types";

export interface ProcessedUserData extends BackendResponse {
	followsSet: Set<string>;
	followersSet: Set<string>;
	allAccounts: Map<string, FollowerInfo>;
}

/**
 * Calculates similarity score between two users on a scale of 0-100
 * Based on Jaccard similarity of their combined follows and followers
 * 100 = identical follows and followers, 0 = no overlap
 */
export function calculateSimilarityScore(
	userAData: ProcessedUserData | undefined,
	userBData: ProcessedUserData | undefined,
): number {
	if (!userAData || !userBData) {
		return 0;
	}

	// Combine follows and followers for each user to get their "network"
	const userANetwork = userAData.followsSet.union(userAData.followersSet);
	const userBNetwork = userBData.followsSet.union(userBData.followersSet);

	// Calculate Jaccard similarity: |A ∩ B| / |A ∪ B|
	const intersection = userANetwork.intersection(userBNetwork);
	const union = userANetwork.union(userBNetwork);

	if (union.size === 0) {
		return 0;
	}

	const similarity = (intersection.size / union.size) * 100;
	return Math.round(similarity);
}

/**
 * Gets all unique accounts from both users as a Map for fast lookup
 */
export function getAllAccountsMap(
	userAData: ProcessedUserData | undefined,
	userBData: ProcessedUserData | undefined,
): Map<string, FollowerInfo> {
	if (!userAData || !userBData) {
		return new Map();
	}

	// Combine all unique accounts from both users
	const allAccounts = new Map<string, FollowerInfo>();
	for (const [handle, account] of userAData.allAccounts) {
		allAccounts.set(handle, account);
	}
	for (const [handle, account] of userBData.allAccounts) {
		allAccounts.set(handle, account);
	}

	// Filter out invalid handles
	allAccounts.delete("handle.invalid");
	return allAccounts;
}

/**
 * Gets all unique accounts from both users as an array
 */
export function getAllAccounts(
	userAData: ProcessedUserData | undefined,
	userBData: ProcessedUserData | undefined,
): FollowerInfo[] {
	return Array.from(getAllAccountsMap(userAData, userBData).values());
}

/**
 * Filters accounts based on selected sets using Set operations
 * Takes an array of sets to intersect and returns matching accounts
 */
export function getFilteredAccounts(
	selectedSets: Set<string>[],
	allAccountsMap: Map<string, FollowerInfo>,
): FollowerInfo[] {
	if (selectedSets.length === 0) {
		return [];
	}

	// Calculate intersection of all selected sets
	let resultSet = selectedSets[0];
	for (let i = 1; i < selectedSets.length; i++) {
		resultSet = resultSet.intersection(selectedSets[i]);
	}
	const resultList = [];
	for (const handle of resultSet) {
		const account = allAccountsMap.get(handle);
		if (account) resultList.push(account);
	}
	return resultList;
}
