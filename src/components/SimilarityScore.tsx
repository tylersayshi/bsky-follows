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
    <div
      className="px-3 py-1.5 rounded-lg border-2 flex items-center gap-3"
      style={{
        borderColor: "var(--border-color)",
      }}
    >
      <span className="text-lg font-bold text-cyan-600 whitespace-nowrap">
        {score} <span className="text-black dark:text-white">/ 100</span>
      </span>
      <span
        className="text-xs font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        {message}
      </span>
    </div>
  );
}
