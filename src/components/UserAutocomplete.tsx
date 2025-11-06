import { useEffect, useState, useDeferredValue } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { useSearchActors } from "../hooks/useBlueskyData.js";
import type { AppBskyActorDefs } from "@atproto/api";

interface UserAutocompleteProps {
  value: string | null;
  onChange: (handle: string) => void;
  label: string;
  tabIndex?: number;
}

export function UserAutocomplete({
  value,
  onChange,
  label,
  tabIndex,
}: UserAutocompleteProps) {
  const [query, setQuery] = useState(value || "");
  const deferredQuery = useDeferredValue(query);
  const { data: actors = [], isLoading } = useSearchActors(deferredQuery);
  const [selectedActor, setSelectedActor] =
    useState<AppBskyActorDefs.ProfileViewBasic | null>(null);

  const isSearching = query !== deferredQuery;

  const handleChange = (actor: AppBskyActorDefs.ProfileViewBasic | null) => {
    setSelectedActor(actor);
    if (actor) {
      onChange(actor.handle);
    }
  };

  useEffect(() => {
    if (value && !selectedActor) {
      setSelectedActor(actors.find((a) => a.handle === value) ?? null);
    }
  }, [actors, selectedActor, value]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>{label}</label>
      <Combobox value={selectedActor} onChange={handleChange}>
        <div className="relative">
          <ComboboxInput
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            style={{
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-primary)',
              borderWidth: '1px',
              borderColor: 'var(--border-color)'
            }}
            placeholder="Search by handle..."
            displayValue={(actor: AppBskyActorDefs.ProfileViewBasic | null) =>
              actor ? `@${actor.handle}` : ""
            }
            onChange={(event) => setQuery(event.target.value)}
            tabIndex={tabIndex}
          />
          <ComboboxOptions
            className="absolute z-10 mt-1 w-full rounded-lg shadow-lg max-h-60 overflow-auto empty:invisible"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderWidth: '1px',
              borderColor: 'var(--border-color)'
            }}
          >
            {isLoading || isSearching ? (
              <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Searching...
              </div>
            ) : deferredQuery.length < 2 ? (
              <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Start typing to search...
              </div>
            ) : actors.length === 0 ? (
              <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                No users found
              </div>
            ) : (
              actors.map((actor) => (
                <ComboboxOption
                  key={actor.did}
                  value={actor}
                  className="autocomplete-option px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors"
                >
                  {actor.avatar && (
                    <img
                      src={actor.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {actor.displayName || actor.handle}
                    </div>
                    <div className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                      @{actor.handle}
                    </div>
                  </div>
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  );
}
