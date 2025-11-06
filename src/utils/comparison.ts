import type { BackendResponse, FollowerInfo } from '../types';

export interface ProcessedUserData extends BackendResponse {
  followsSet: Set<string>;
  followersSet: Set<string>;
  allAccounts: Map<string, FollowerInfo>;
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
  // For each user's filters, union the selected sets (OR logic within filter group)
  let aFilterSet = new Set<string>();
  for (const filter of aFilters) {
    if (filter === 'following') {
      aFilterSet = aFilterSet.union(userAData.followsSet);
    } else if (filter === 'followed-by') {
      aFilterSet = aFilterSet.union(userAData.followersSet);
    }
  }

  let bFilterSet = new Set<string>();
  for (const filter of bFilters) {
    if (filter === 'following') {
      bFilterSet = bFilterSet.union(userBData.followsSet);
    } else if (filter === 'followed-by') {
      bFilterSet = bFilterSet.union(userBData.followersSet);
    }
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

  // Map handles back to account info
  return Array.from(resultSet).map(handle => allAccounts.get(handle)!);
}
