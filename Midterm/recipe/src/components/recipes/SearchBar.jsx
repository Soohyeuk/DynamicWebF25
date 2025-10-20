import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(value.trim());
  };

  return (
    <form onSubmit={submit} className="relative max-w-2xl mx-auto">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <FiSearch className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search recipes by title or ingredient..."
        className="w-full rounded-full border border-gray-300 bg-white pl-12 pr-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
      />
    </form>
  );
}


