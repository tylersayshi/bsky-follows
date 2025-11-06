import { useDeferredValue } from "react";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { UserAutocomplete } from "./components/UserAutocomplete";
import { AccountsList } from "./components/AccountsList";
import { SimilarityScore } from "./components/SimilarityScore";
import {TylurLink} from "./components/TylurLink";
import { useBlueskyFollows } from "./hooks/useBlueskyData";
import {
	getFilteredAccounts,
	calculateSimilarityScore,
} from "./utils/comparison";
import { ErrorMessage } from "./components/ErrorMessage";

const userAOptions = [
	{ value: "following", label: "Following" },
	{ value: "followed-by", label: "Followed By" },
];

const userBOptions = [
	{ value: "following", label: "Following" },
	{ value: "followed-by", label: "Followed By" },
];


function App() {
	const [state, setState] = useQueryStates({
		a: parseAsString,
		b: parseAsString,
		aFilters: parseAsArrayOf(parseAsString).withDefault([]),
		bFilters: parseAsArrayOf(parseAsString).withDefault([]),
	});

	const { data: userAData, isLoading: isLoadingA, error: errorA } = useBlueskyFollows(state.a);
	const { data: userBData, isLoading: isLoadingB, error: errorB } = useBlueskyFollows(state.b);

	// Defer the filter values so UI updates immediately but filtering happens in background
	const deferredAFilters = useDeferredValue(state.aFilters);
	const deferredBFilters = useDeferredValue(state.bFilters);

	const filteredAccounts = getFilteredAccounts(
		userAData,
		userBData,
		deferredAFilters,
		deferredBFilters,
	);

	const isFiltering =
		state.aFilters !== deferredAFilters || state.bFilters !== deferredBFilters;

	const similarityScore = calculateSimilarityScore(userAData, userBData);

	return (
		<div className="min-h-screen py-6 px-4 bg-white dark:bg-black flex flex-col justify-between">
			<div className="container mx-auto max-w-5xl">
				<div className="flex items-center justify-between mb-2">
					<h1
						className="text-3xl font-bold bg-cyan-400 bg-clip-text text-transparent"
						style={{
							fontFamily:
								"Chalkboard,ChalkboardSE-Regular,ChalkboardSE,ChalkDuster,Comic Sans MS,comic-sans,sans-serif",
						}}
					>
						Bluesky Follows
					</h1>
					{userAData && userBData && (
						<SimilarityScore score={similarityScore} />
					)}
				</div>
				<p className="mb-2 text-sm" style={{ color: "var(--text-secondary)" }}>
					A tool for viewing the follower relationships of bluesky users.
				</p>

				{/* User Selection */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
					<div>
						<UserAutocomplete
							label=""
							value={state.a}
							onChange={(handle) => setState({ a: handle })}
							tabIndex={1}
						/>
						{isLoadingA && (
							<div className="mt-3 flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
								<span
									className="text-sm"
									style={{ color: "var(--text-secondary)" }}
								>
									Loading data...
								</span>
							</div>
						)}
						{errorA && <ErrorMessage error={errorA} />}
						{userAData && (
							<div className="mt-3 flex items-center gap-4 text-sm">
								<div className="flex gap-4">
									<span style={{ color: "var(--text-secondary)" }}>
										<span className="font-semibold text-blue-600">
											{userAData.followers.length}
										</span>{" "}
										followers
									</span>
									<span style={{ color: "var(--text-secondary)" }}>
										<span className="font-semibold text-cyan-600">
											{userAData.follows.length}
										</span>{" "}
										follows
									</span>
								</div>
								<div className="ml-auto flex gap-2">
									{userAOptions.map((option, index) => {
										const isSelected = state.aFilters.includes(option.value);
										return (
											<button
												key={option.value}
												type="button"
												tabIndex={3 + index}
												onClick={() => {
													if (isSelected) {
														setState({
															aFilters: state.aFilters.filter(
																(v) => v !== option.value,
															),
														});
													} else {
														setState({
															aFilters: [...state.aFilters, option.value],
														});
													}
												}}
												className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500 ${
													isSelected
														? "bg-cyan-600 text-white hover:bg-cyan-700"
														: "bg-gray-200 text-gray-700 hover:bg-gray-300"
												}`}
											>
												{option.label}
											</button>
										);
									})}
								</div>
							</div>
						)}
					</div>

					<div>
						<UserAutocomplete
							label=""
							value={state.b}
							onChange={(handle) => setState({ b: handle })}
							tabIndex={2}
						/>
						{isLoadingB && (
							<div className="mt-3 flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
								<span
									className="text-sm"
									style={{ color: "var(--text-secondary)" }}
								>
									Loading data...
								</span>
							</div>
						)}
						{errorB && <ErrorMessage error={errorB} />}
						{userBData && (
							<div className="mt-3 flex items-center gap-4 text-sm">
								<div className="flex gap-4">
									<span style={{ color: "var(--text-secondary)" }}>
										<span className="font-semibold text-blue-600">
											{userBData.followers.length}
										</span>{" "}
										followers
									</span>
									<span style={{ color: "var(--text-secondary)" }}>
										<span className="font-semibold text-cyan-600">
											{userBData.follows.length}
										</span>{" "}
										follows
									</span>
								</div>
								<div className="ml-auto flex gap-2">
									{userBOptions.map((option, index) => {
										const isSelected = state.bFilters.includes(option.value);
										return (
											<button
												key={option.value}
												type="button"
												tabIndex={5 + index}
												onClick={() => {
													if (isSelected) {
														setState({
															bFilters: state.bFilters.filter(
																(v) => v !== option.value,
															),
														});
													} else {
														setState({
															bFilters: [...state.bFilters, option.value],
														});
													}
												}}
												className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500 ${
													isSelected
														? "bg-cyan-600 text-white hover:bg-cyan-700"
														: "bg-gray-200 text-gray-700 hover:bg-gray-300"
												}`}
											>
												{option.label}
											</button>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Results */}
				{userAData && userBData && (
					<div
						style={{
							opacity: isFiltering ? 0.6 : 1,
							transition: "opacity 0.2s",
						}}
					>
						<h2
							className="text-lg font-semibold mb-2"
							style={{ color: "var(--text-primary)" }}
						>
							Results{" "}
							<span className="text-cyan-600">({filteredAccounts.length})</span>
						</h2>
						<AccountsList accounts={filteredAccounts} />
					</div>
				)}

				{/* Footer */}
			</div>
				<footer className="mt-12 pt-6 border-t flex items-center justify-center gap-4" style={{ borderColor: "var(--border-color, #e5e7eb)" }}>
					<TylurLink />
					<a
						href="https://github.com/tylersayshi/bsky-follows"
						target="_blank"
						rel="noopener noreferrer"
						className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 rounded focus-visible:scale-110"
						aria-label="View source on GitHub"
						tabIndex={7}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
						</svg>
					</a>
				</footer>
		</div>
	);
}

export default App;
