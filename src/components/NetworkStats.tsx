import { parseAsString, useQueryStates } from 'nuqs';
import { useBlueskyProfile } from '../hooks/useBlueskyData';

interface NetworkStatsProps {
  mutualCount: number;
  user1OnlyCount: number;
  user2OnlyCount: number;
  totalUnique: number;
  similarityScore: number;
}

function getSimilarityMessage(score: number): string {
	if (score === 100) return "🐑 dolly!";
	if (score >= 30) return "Practically soulmates";
	if (score >= 20) return "People ask if we're related";
	if (score >= 14) return "F is for Friends";
	if (score >= 12) return "We should hangout";
	if (score >= 10) return "We should start a club";
	if (score >= 7) return "My friend knows your friend";
	if (score >= 2) return "Not strangers";
	return "Different worlds";
}

export function NetworkStats({
  mutualCount,
  user1OnlyCount,
  user2OnlyCount,
  totalUnique,
  similarityScore,
}: NetworkStatsProps) {
  const [state] = useQueryStates({
    a: parseAsString,
    b: parseAsString,
  });

  const { data: user1 } = useBlueskyProfile(state.a);
  const { data: user2 } = useBlueskyProfile(state.b);

  const overlapPercentage = totalUnique > 0 ? (mutualCount / totalUnique) * 100 : 0;
  const message = getSimilarityMessage(similarityScore);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Similarity Score */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Similarity Score</div>
        <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{similarityScore} / 100</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {message}
        </div>
      </div>

      {/* Mutual Follows */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Shared Following</div>
        <div className="text-3xl font-bold text-green-600 dark:text-green-400">{mutualCount.toLocaleString()}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {overlapPercentage.toFixed(1)}% overlap
        </div>
      </div>

      {/* User 1 Unique */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Only {user1?.displayName || state.a}</div>
        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
          {user1OnlyCount.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">unique follows</div>
      </div>

      {/* User 2 Unique */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Only {user2?.displayName || state.b}</div>
        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
          {user2OnlyCount.toLocaleString()}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">unique follows</div>
      </div>
    </div>
  );
}
