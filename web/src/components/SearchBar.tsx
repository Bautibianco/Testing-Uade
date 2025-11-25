import React from 'react';

interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, placeholder, onChange }) => {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  );
};

export default SearchBar;


