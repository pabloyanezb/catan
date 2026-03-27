"use client";

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, string>;
}) {
  return (
    <div className="flex bg-catan-surface rounded-md">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`
            flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer
            ${value === option
              ? "bg-catan-parchment text-catan-bg"
              : "bg-transparent text-catan-muted hover:text-catan-text"
            }
          `}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}