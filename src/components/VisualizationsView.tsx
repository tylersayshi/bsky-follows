import { NetworkStats } from './NetworkStats';
import { FollowersVennDiagram } from './FollowersVennDiagram';

interface VisualizationsViewProps {
  user1Followers: Set<string>;
  user2Followers: Set<string>;
  user1Following: Set<string>;
  user2Following: Set<string>;
  mutualCount: number;
  user1OnlyCount: number;
  user2OnlyCount: number;
  totalUnique: number;
  similarityScore: number;
}

export function VisualizationsView({
  user1Followers,
  user2Followers,
  user1Following,
  user2Following,
  mutualCount,
  user1OnlyCount,
  user2OnlyCount,
  totalUnique,
  similarityScore,
}: VisualizationsViewProps) {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <NetworkStats
        mutualCount={mutualCount}
        user1OnlyCount={user1OnlyCount}
        user2OnlyCount={user2OnlyCount}
        totalUnique={totalUnique}
        similarityScore={similarityScore}
      />

      {/* Venn Diagram */}
      <FollowersVennDiagram
        user1Followers={user1Followers}
        user2Followers={user2Followers}
        user1Following={user1Following}
        user2Following={user2Following}
      />
    </div>
  );
}
