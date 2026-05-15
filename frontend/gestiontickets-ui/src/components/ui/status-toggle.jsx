import React from "react";
import { cn } from "@/lib/utils";

export function StatusToggle({ value, onChange, options = [] }) {
  return (
    <div className="flex h-9 p-1 bg-zinc-200/60 dark:bg-zinc-800 rounded-md w-fit">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "px-4 py-0 text-xs font-bold rounded-md transition-all whitespace-nowrap tracking-normal",
            value === option.id
              ? "bg-[#1e293b] text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}