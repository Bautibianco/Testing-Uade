import React from 'react';
import { EventType } from '../types';

export type FilterOption = 'ALL' | EventType;

interface FilterDropdownProps {
  value: FilterOption;
  onChange: (value: FilterOption) => void;
}

const optionLabels: Record<FilterOption, string> = {
  ALL: 'Todos',
  EXAM: 'Exámenes',
  DELIVERY: 'Entregas',
  CLASS: 'Recordatorios'
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full md:w-60">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as FilterOption)}
        className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {(Object.keys(optionLabels) as FilterOption[]).map(option => (
          <option key={option} value={option}>
            {optionLabels[option]}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.7-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
        </svg>
      </span>
    </div>
  );
};

export default FilterDropdown;


