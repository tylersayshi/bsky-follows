import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { AccountsList } from './AccountsList';
import { VisualizationsView } from './VisualizationsView';
import type { FollowerInfo } from '../types';

interface ResultsTabsProps {
  user1Followers: Set<string>;
  user2Followers: Set<string>;
  user1Following: Set<string>;
  user2Following: Set<string>;
  filteredAccounts: FollowerInfo[];
  mutualCount: number;
  user1OnlyCount: number;
  user2OnlyCount: number;
  totalUnique: number;
  similarityScore: number;
}

const TABS = ['list', 'visuals'] as const;
type TabValue = (typeof TABS)[number];

export function ResultsTabs({
  user1Followers,
  user2Followers,
  user1Following,
  user2Following,
  filteredAccounts,
  mutualCount,
  user1OnlyCount,
  user2OnlyCount,
  totalUnique,
  similarityScore,
}: ResultsTabsProps) {
  const [selectedTab, setSelectedTab] = useQueryState(
    'tab',
    parseAsStringLiteral(TABS).withDefault('list')
  );

  const selectedIndex = TABS.indexOf(selectedTab as TabValue);

  const handleTabChange = (index: number) => {
    setSelectedTab(TABS[index]);
  };

  return (
    <TabGroup selectedIndex={selectedIndex} onChange={handleTabChange}>
      <TabList className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <Tab className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border-b-2 border-transparent focus:outline-none data-[selected]:text-cyan-600 data-[selected]:dark:text-cyan-400 data-[selected]:border-cyan-600 data-[selected]:dark:border-cyan-400 data-[hover]:text-gray-900 data-[hover]:dark:text-gray-200 transition-colors">
          List View
        </Tab>
        <Tab className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border-b-2 border-transparent focus:outline-none data-[selected]:text-cyan-600 data-[selected]:dark:text-cyan-400 data-[selected]:border-cyan-600 data-[selected]:dark:border-cyan-400 data-[hover]:text-gray-900 data-[hover]:dark:text-gray-200 transition-colors">
          Visuals
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <div>
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Results{" "}
              <span className="text-cyan-600">({filteredAccounts.length})</span>
            </h2>
            <AccountsList accounts={filteredAccounts} />
          </div>
        </TabPanel>
        <TabPanel>
          <VisualizationsView
            user1Followers={user1Followers}
            user2Followers={user2Followers}
            user1Following={user1Following}
            user2Following={user2Following}
            mutualCount={mutualCount}
            user1OnlyCount={user1OnlyCount}
            user2OnlyCount={user2OnlyCount}
            totalUnique={totalUnique}
            similarityScore={similarityScore}
          />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
