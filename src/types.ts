// Backend API response types
export interface FollowerInfo {
  handle: string;
  displayName?: string;
  avatar?: string;
}

export interface BackendResponse {
  followers: FollowerInfo[];
  follows: FollowerInfo[];
  fromCache: boolean;
  cached: boolean;
  cacheHits?: number;
}

// Filter state types
export type FollowingFilter = 'following' | 'neither' | 'notFollowing';
export type FollowedByFilter = 'followedBy' | 'neither' | 'notFollowedBy';

// Computed comparison sets for each user
export interface UserComparison {
  following: FollowerInfo[];
  notFollowing: FollowerInfo[];
  followedBy: FollowerInfo[];
  notFollowedBy: FollowerInfo[];
}
