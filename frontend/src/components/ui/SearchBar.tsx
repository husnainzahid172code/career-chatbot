import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search jobs, skills, or career paths..." }: SearchBarProps) {
  return (
    <div className="relative">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-disabled" />
      <input
        className="w-full rounded-2xl border border-default bg-card py-3.5 pl-11 pr-4 text-sm text-primary placeholder:text-disabled outline-none transition-all focus:border-badge focus:ring-2 focus:ring-badge/20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
