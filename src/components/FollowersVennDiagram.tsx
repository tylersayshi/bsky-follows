import { useState, useRef, useEffect } from "react";
import { VennDiagram, VennSeries, VennArc, VennLabel } from "reaviz";
import { useBlueskyProfile } from "../hooks/useBlueskyData";
import { useFilters } from "../hooks/useFilters";

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
	const [state, setState] = useFilters();

	const { data: user1 } = useBlueskyProfile(state.a);
	const { data: user2 } = useBlueskyProfile(state.b);

	const [hoveredData, setHoveredData] = useState<string | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 550, height: 400 });

	useEffect(() => {
		const updateDimensions = () => {
			if (containerRef.current) {
				const width = containerRef.current.offsetWidth - 32; // Account for padding
				const height = Math.min(width * 0.73, 400); // Maintain aspect ratio, max 400
				setDimensions({ width, height });
			}
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);
	// Helper to calculate intersection size for any combination of sets
	const getIntersectionSize = (sets: Set<string>[]) => {
		if (sets.length === 0) return 0;
		let result = sets[0];
		for (let i = 1; i < sets.length; i++) {
			result = result.intersection(sets[i]);
		}
		return result.size;
	};

	// Use stable keys that won't change when display names load
	const user1FollowersKey = "a-followers";
	const user2FollowersKey = "b-followers";
	const user1FollowingKey = "a-following";
	const user2FollowingKey = "b-following";

	// Create unique labels for each set with display names for the Venn diagram
	const user1FollowersLabel = `${user1?.displayName || state.a}'s followers`;
	const user2FollowersLabel = `${user2?.displayName || state.b}'s followers`;
	const user1FollowingLabel = `${user1?.displayName || state.a} follows`;
	const user2FollowingLabel = `${user2?.displayName || state.b} follows`;

	// Map labels to stable keys for URL storage
	const labelToKeyMap = new Map([
		[user1FollowersLabel, user1FollowersKey],
		[user2FollowersLabel, user2FollowersKey],
		[user1FollowingLabel, user1FollowingKey],
		[user2FollowingLabel, user2FollowingKey],
	]);

	// Map keys back to labels for display
	const keyToLabelMap = new Map([
		[user1FollowersKey, user1FollowersLabel],
		[user2FollowersKey, user2FollowersLabel],
		[user1FollowingKey, user1FollowingLabel],
		[user2FollowingKey, user2FollowingLabel],
	]);

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
			data: getIntersectionSize([user1Followers, user2Followers]),
		},
		{
			key: [user1FollowersLabel, user1FollowingLabel],
			data: getIntersectionSize([user1Followers, user1Following]),
		},
		{
			key: [user1FollowersLabel, user2FollowingLabel],
			data: getIntersectionSize([user1Followers, user2Following]),
		},
		{
			key: [user2FollowersLabel, user1FollowingLabel],
			data: getIntersectionSize([user2Followers, user1Following]),
		},
		{
			key: [user2FollowersLabel, user2FollowingLabel],
			data: getIntersectionSize([user2Followers, user2Following]),
		},
		{
			key: [user1FollowingLabel, user2FollowingLabel],
			data: getIntersectionSize([user1Following, user2Following]),
		},

		// 3-way intersections
		{
			key: [user1FollowersLabel, user2FollowersLabel, user1FollowingLabel],
			data: getIntersectionSize([
				user1Followers,
				user2Followers,
				user1Following,
			]),
		},
		{
			key: [user1FollowersLabel, user2FollowersLabel, user2FollowingLabel],
			data: getIntersectionSize([
				user1Followers,
				user2Followers,
				user2Following,
			]),
		},
		{
			key: [user1FollowersLabel, user1FollowingLabel, user2FollowingLabel],
			data: getIntersectionSize([
				user1Followers,
				user1Following,
				user2Following,
			]),
		},
		{
			key: [user2FollowersLabel, user1FollowingLabel, user2FollowingLabel],
			data: getIntersectionSize([
				user2Followers,
				user1Following,
				user2Following,
			]),
		},

		// 4-way intersection
		{
			key: [
				user1FollowersLabel,
				user2FollowersLabel,
				user1FollowingLabel,
				user2FollowingLabel,
			],
			data: getIntersectionSize([
				user1Followers,
				user2Followers,
				user1Following,
				user2Following,
			]),
		},
	];

	// Filter out items with no data and deduplicate by key
	const seenKeys = new Set<string>();
	const vennData = allIntersections
		.filter((item) => item.data > 0)
		.filter((item) => {
			const keyString = item.key.join("_");
			if (seenKeys.has(keyString)) {
				return false;
			}
			seenKeys.add(keyString);
			return true;
		});

	// Derive selected data from state using allIntersections
	const selectedData = (() => {
		if (state.selectedSets.length === 0) return null;

		// Convert keys back to labels
		const selectedLabels = state.selectedSets
			.map((key) => keyToLabelMap.get(key))
			.filter((label): label is string => label !== undefined);

		if (selectedLabels.length === 0) return null;

		// Find matching intersection in allIntersections
		const matchingIntersection = allIntersections.find((item) => {
			if (item.key.length !== selectedLabels.length) return false;
			return selectedLabels.every((label) => item.key.includes(label));
		});

		if (!matchingIntersection) return null;

		return `${selectedLabels.join(" & ")} - ${matchingIntersection.data.toLocaleString()}`;
	})();

	const displayData = hoveredData || selectedData;

	return (
		<div className="flex flex-col items-center md:absolute top-0 right-0">
			<div
				className={
					"mb-2 absolute top-0 right-0 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-800 z-10" +
					(!displayData ? " bg-white/0! border-white/0" : "")
				}
			>
				<p className="text-sm font-medium text-gray-900 dark:text-gray-100 min-h-5 whitespace-nowrap">
					{displayData}
				</p>
			</div>
			<div ref={containerRef} className="bg-white mt-4 dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 relative z-0 text-gray-900 dark:text-gray-100 overflow-visible w-full sm:w-[400px] md:w-[500px] lg:w-[600px] max-w-2xl">
				<VennDiagram
					height={dimensions.height}
					width={dimensions.width}
					data={vennData}
					series={
						<VennSeries
							colorScheme={["#ffee32","#168aad", "#ffd100", "#168aad"]}
							arc={
								<VennArc
									tooltip={null}
                  gradient={null}
									strokeWidth={3}
									style={{ cursor: "pointer" }}
									onMouseEnter={({ value }) => {
										setHoveredData(
											`${value.sets.join(" & ")} - ${value.size.toLocaleString()}`,
										);
									}}
									onMouseLeave={() => setHoveredData(null)}
									onClick={({ value }) => {
										// Convert labels to stable keys for URL storage
										const keys = value.sets.map(
											(label: string) => labelToKeyMap.get(label) || label,
										);
										setState({ selectedSets: keys });
									}}
								/>
							}
							
						/>
					}
				/>
				<div className="absolute bottom-2 left-2 text-xs text-gray-400 dark:text-gray-500 italic">
					click the chart
				</div>
			</div>
		</div>
	);
}
