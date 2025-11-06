export function ErrorMessage({ error }: { error: Error }) {
	const errorMessage = error.message;
	const isBot = errorMessage.includes("bot for following more than 10k");
	const isTooPopular = errorMessage.includes("top 500");

	return (
		<div className="mt-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/50">


					<p className="text-sm font-medium text-orange-800 dark:text-orange-200">
						{errorMessage}
					</p>
					{(isBot || isTooPopular) && (
						<p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
							Ask me on Bluesky:{" "}
							<a
								href="https://bsky.app/profile/tylur.dev"
								target="_blank"
								rel="noopener noreferrer"
								className="underline hover:text-orange-900 dark:hover:text-orange-100 font-medium"
							>
								@tylur.dev
							</a>
						</p>
					)}

		</div>
	);
}