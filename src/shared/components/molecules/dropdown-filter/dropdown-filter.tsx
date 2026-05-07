import React from 'react';
import './dropdown-filter.scss';

interface Option {
  value: string;
  label: string;
}

export interface DropdownFilterProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
}

export const DropdownFilter: React.FC<DropdownFilterProps> = ({
  label,
  value,
  options,
  onChange,
  className = '',
}) => {
  return (
    <div className={`f1-dropdown-filter flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded border border-slate-700 bg-slate-800 px-3 text-sm text-slate-100 shadow focus:border-red-500 focus:outline-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
