import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { NuqsAdapter } from "nuqs/adapters/react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createIDBPersister } from "./utils/queryPersister";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 15, // 15 minutes - matches our revalidation window
			gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep data in cache longer
			refetchOnWindowFocus: false,
		},
	},
});

const persister = createIDBPersister();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister }}
		>
			<NuqsAdapter>
				<App />
			</NuqsAdapter>
		</PersistQueryClientProvider>
	</StrictMode>,
);
