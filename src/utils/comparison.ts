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
 * Filters accounts based on selected filters using Set operations
 * Filters work as checkboxes for User A and User B
 */
export function getFilteredAccounts(
	userAData: ProcessedUserData | undefined,
	userBData: ProcessedUserData | undefined,
	aFilters: string[],
	bFilters: string[],
): FollowerInfo[] {
	if (!userAData || !userBData) {
		return [];
	}

	if (aFilters.length === 0 && bFilters.length === 0) {
		return [];
	}

	// Combine all unique accounts from both users
	const allAccounts = new Map<string, FollowerInfo>();
	for (const [handle, account] of userAData.allAccounts) {
		allAccounts.set(handle, account);
	}
	for (const [handle, account] of userBData.allAccounts) {
		allAccounts.set(handle, account);
	}

	// Build filter sets using Set operations
	// When both filters are selected, use intersection (AND logic)
	// When only one filter is selected, use that set directly
	let aFilterSet = new Set<string>();
	if (aFilters.includes("following") && aFilters.includes("followed-by")) {
		aFilterSet = userAData.followsSet.intersection(userAData.followersSet);
	} else if (aFilters.includes("following")) {
		aFilterSet = userAData.followsSet;
	} else if (aFilters.includes("followed-by")) {
		aFilterSet = userAData.followersSet;
	}

	let bFilterSet = new Set<string>();
	if (bFilters.includes("following") && bFilters.includes("followed-by")) {
		bFilterSet = userBData.followsSet.intersection(userBData.followersSet);
	} else if (bFilters.includes("following")) {
		bFilterSet = userBData.followsSet;
	} else if (bFilters.includes("followed-by")) {
		bFilterSet = userBData.followersSet;
	}

	// Intersect the two filter sets (AND logic between filter groups)
	let resultSet: Set<string>;
	if (aFilters.length > 0 && bFilters.length > 0) {
		resultSet = aFilterSet.intersection(bFilterSet);
	} else if (aFilters.length > 0) {
		resultSet = aFilterSet;
	} else {
		resultSet = bFilterSet;
	}

	// filter out any invalid handles
	resultSet.delete("handle.invalid");
	// Map handles back to account info
	return Array.from(resultSet).map((handle) => allAccounts.get(handle)!);
}
