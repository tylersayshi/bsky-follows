import type { FollowerInfo } from "../types";

interface AccountsListProps {
	accounts: FollowerInfo[];
}

export function AccountsList({ accounts }: AccountsListProps) {
	if (accounts.length === 0) {
		return (
			<div
				className="py-12"
				style={{ color: "var(--text-secondary)" }}
			>
				No accounts match the selected filters
			</div>
		);
	}

	return (
		<div className="space-y-1.5">
			{accounts.map((account) => (
				<a
					key={account.handle}
					href={`https://bsky.app/profile/${account.handle}`}
					target="_blank"
					rel="noopener noreferrer"
					tabIndex={6}
					className="flex items-center gap-3 p-2.5 focus:outline-none hover:ring-2 focus:ring-2 hover:ring-cyan-500 focus:ring-cyan-500 rounded-lg transition-all duration-200 cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-700 hover:bg-opacity-60 focus:bg-gray-100 dark:focus:bg-gray-700 focus:bg-opacity-60 max-w-[650px] text-ellipsis"
				>
					{account.avatar && (
						<img
							src={account.avatar}
							alt={`avatar of ${account.handle}`}
							loading="lazy"
							className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-cyan-400 group-focus:border-cyan-400 transition-colors"
						/>
					)}
					<div className="flex-1 min-w-0">
						<div
							className="font-medium truncate group-hover:text-cyan-600 group-focus:text-cyan-600 transition-colors"
							style={{ color: "var(--text-primary)" }}
						>
							{account.displayName || account.handle}
						</div>
						<div
							className="text-sm truncate"
							style={{ color: "var(--text-secondary)" }}
						>
							@{account.handle}
						</div>
					</div>
				</a>
			))}
		</div>
	);
}
