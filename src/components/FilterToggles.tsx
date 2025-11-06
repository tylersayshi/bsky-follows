interface FilterTogglesProps {
  label: string;
  value: string[];
  onChange: (values: string[]) => void;
  options: Array<{ value: string; label: string }>;
}

export function FilterToggles({
  label,
  value,
  onChange,
  options,
}: FilterTogglesProps) {
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="space-y-1">
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <label
              key={option.value}
              className="flex items-center gap-1 cursor-pointer hover:bg-gray-200 rounded-md transition-colors w-fit pr-2 pl-1 -ml-1 py-0.5"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleOption(option.value)}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-400"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
