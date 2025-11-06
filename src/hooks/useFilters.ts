import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";

export function useFilters() {
	const [state, setState] = useQueryStates({
		a: parseAsString,
		b: parseAsString,
		selectedSets: parseAsArrayOf(parseAsString).withDefault([]),
	});

	return [state, setState] as const;
}
