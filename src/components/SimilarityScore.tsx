interface SimilarityScoreProps {
  score: number;
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

export function SimilarityScore({ score }: SimilarityScoreProps) {
  const message = getSimilarityMessage(score);

  return (
    <div>
      <div
        className="px-3 py-2 rounded-lg border-2"
        style={{
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex flex-col w-24 text-center justify-center items-center gap-2">
          <span className="text-xl font-bold text-cyan-600">
            {score} <span className="text-black dark:text-white">/ 100</span>
          </span>
          <span
            className="text-xs font-medium block"
            style={{ color: "var(--text-secondary)" }}
          >
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}
