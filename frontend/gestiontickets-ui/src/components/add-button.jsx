import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function AddButton({
  onClick,
  label = "Nueva",
  className,
  disabled = false,
}) {

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName);

      if (e.key.toLowerCase() === "insert" && !isTyping && !disabled) {
        e.preventDefault();
        onClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClick, disabled]);

  return (
    <button
      onClick={onClick}
      disabled={disabled}  
      className={cn(
        "group relative flex h-8 w-full md:w-auto items-center justify-center gap-1 px-2 shrink-0 rounded-md",
        "border border-[#1e293b]/20 bg-[#1e293b] text-[#ffffff]",
        "shadow-[0_8px_166px_-6px_rgba(122,14,180,0.2)]",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-[#1e293b]/70 hover:border-[#1e293b]/40 active:bg-[#1e293b]/30",
        "transition-all",
        className
      )}
    >
      <div className="absolute inset-0 rounded-sm bg-gradient-to-tr from-[#1e293b]/20 to-transparent opacity-50" />

      <Plus size={18} strokeWidth={2.5} className="relative z-10" />

      <span className="relative z-10 text-sm font-bold tracking-tight">
        {label}
      </span>
    </button>
  );
}