import { useDeferredValue } from "react";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { UserAutocomplete } from "./components/UserAutocomplete";
import { AccountsList } from "./components/AccountsList";
import { SimilarityScore } from "./components/SimilarityScore";
import { useBlueskyFollows } from "./hooks/useBlueskyData";
import {
  getFilteredAccounts,
  calculateSimilarityScore,
} from "./utils/comparison";

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

  const { data: userAData, isLoading: isLoadingA } = useBlueskyFollows(state.a);
  const { data: userBData, isLoading: isLoadingB } = useBlueskyFollows(state.b);

  // Defer the filter values so UI updates immediately but filtering happens in background
  const deferredAFilters = useDeferredValue(state.aFilters);
  const deferredBFilters = useDeferredValue(state.bFilters);

  const filteredAccounts = getFilteredAccounts(
    userAData,
    userBData,
    deferredAFilters,
    deferredBFilters
  );

  const isFiltering =
    state.aFilters !== deferredAFilters || state.bFilters !== deferredBFilters;

  const similarityScore = calculateSimilarityScore(userAData, userBData);

  return (
    <div className="min-h-screen py-6 px-4 bg-white dark:bg-black">
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

        {/* User Selection */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 pb-6 border-b-2"
          style={{ borderColor: "var(--border-color)" }}
        >
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
                                (v) => v !== option.value
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
                                (v) => v !== option.value
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
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Results{" "}
              <span className="text-cyan-600">
                ({filteredAccounts.length})
              </span>
            </h2>
            <AccountsList accounts={filteredAccounts} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
