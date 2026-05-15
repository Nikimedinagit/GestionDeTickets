import React from "react";
import { Search } from "lucide-react";

export function TableSearch({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="relative w-full md:w-80 flex">
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" 
        size={14} 
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-4 bg-white font-bold dark:bg-zinc-900 border-2 border-zinc-200/60 dark:border-zinc-800 rounded-md text-xs focus:outline-none focus:border-[#1e293b]/30 transition-colors shadow-sm"
      />
    </div>
  );
}