import { useState } from 'react';
import { parseAsString, useQueryStates } from 'nuqs';
import { VennDiagram, VennSeries, VennArc, VennLabel } from 'reaviz';
import { useBlueskyProfile } from '../hooks/useBlueskyData';

interface FollowersVennDiagramProps {
  user1Followers: Set<string>;
  user2Followers: Set<string>;
  user1Following: Set<string>;
  user2Following: Set<string>;
}

export function FollowersVennDiagram({
  user1Followers,
  user2Followers,
  user1Following,
  user2Following,
}: FollowersVennDiagramProps) {
  const [state] = useQueryStates({
    a: parseAsString,
    b: parseAsString,
  });

  const { data: user1 } = useBlueskyProfile(state.a);
  const { data: user2 } = useBlueskyProfile(state.b);

  const [hoveredData, setHoveredData] = useState<string | null>(null);
  // Helper to calculate intersection size for any combination of sets
  const getIntersectionSize = (sets: Set<string>[]) => {
    if (sets.length === 0) return 0;
    return [...sets[0]].filter(did =>
      sets.slice(1).every(set => set.has(did))
    ).length;
  };

  // Create unique labels for each set
  const user1FollowersLabel = `${user1?.displayName || state.a}'s followers`;
  const user2FollowersLabel = `${user2?.displayName || state.b}'s followers`;
  const user1FollowingLabel = `${user1?.displayName || state.a}'s following`;
  const user2FollowingLabel = `${user2?.displayName || state.b}'s following`;

  // Build all possible intersections
  const allIntersections = [
    // Individual sets
    { key: [user1FollowersLabel], data: user1Followers.size },
    { key: [user2FollowersLabel], data: user2Followers.size },
    { key: [user1FollowingLabel], data: user1Following.size },
    { key: [user2FollowingLabel], data: user2Following.size },

    // 2-way intersections
    {
      key: [user1FollowersLabel, user2FollowersLabel],
      data: getIntersectionSize([user1Followers, user2Followers])
    },
    {
      key: [user1FollowersLabel, user1FollowingLabel],
      data: getIntersectionSize([user1Followers, user1Following])
    },
    {
      key: [user1FollowersLabel, user2FollowingLabel],
      data: getIntersectionSize([user1Followers, user2Following])
    },
    {
      key: [user2FollowersLabel, user1FollowingLabel],
      data: getIntersectionSize([user2Followers, user1Following])
    },
    {
      key: [user2FollowersLabel, user2FollowingLabel],
      data: getIntersectionSize([user2Followers, user2Following])
    },
    {
      key: [user1FollowingLabel, user2FollowingLabel],
      data: getIntersectionSize([user1Following, user2Following])
    },

    // 3-way intersections
    {
      key: [user1FollowersLabel, user2FollowersLabel, user1FollowingLabel],
      data: getIntersectionSize([user1Followers, user2Followers, user1Following])
    },
    {
      key: [user1FollowersLabel, user2FollowersLabel, user2FollowingLabel],
      data: getIntersectionSize([user1Followers, user2Followers, user2Following])
    },
    {
      key: [user1FollowersLabel, user1FollowingLabel, user2FollowingLabel],
      data: getIntersectionSize([user1Followers, user1Following, user2Following])
    },
    {
      key: [user2FollowersLabel, user1FollowingLabel, user2FollowingLabel],
      data: getIntersectionSize([user2Followers, user1Following, user2Following])
    },

    // 4-way intersection
    {
      key: [user1FollowersLabel, user2FollowersLabel, user1FollowingLabel, user2FollowingLabel],
      data: getIntersectionSize([user1Followers, user2Followers, user1Following, user2Following])
    },
  ];

  // Filter out items with no data and deduplicate by key
  const seenKeys = new Set<string>();
  const vennData = allIntersections
    .filter((item) => item.data > 0)
    .filter((item) => {
      const keyString = item.key.join('_');
      if (seenKeys.has(keyString)) {
        return false;
      }
      seenKeys.add(keyString);
      return true;
    });

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Network Overlap Visualization
      </h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <VennDiagram
          height={500}
          width={800}
          data={vennData}
          series={
            <VennSeries
              colorScheme="Pastel1"
              arc={
                <VennArc
                tooltip={null}
                  strokeWidth={3}
                  onMouseEnter={({ value }) => {
                    setHoveredData(`${value.sets.join(' & ')} - ${value.size.toLocaleString()}`);
                  }}
                  onMouseLeave={() => setHoveredData(null)}
                />
              }
              label={
                <VennLabel
                  showAll={true}
                  format={(datum) => {
                    // Show key for single circles, value for intersections
                    if (datum.data.sets.length === 1) {
                      return datum.data.sets[0];
                    }
                    return datum.data.size.toLocaleString();
                  }}
                />
              }
            />
          }
        />
      </div>
      {hoveredData && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {hoveredData}
          </p>
        </div>
      )}
    </div>
  );
}
