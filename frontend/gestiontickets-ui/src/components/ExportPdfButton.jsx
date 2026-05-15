import React, { useEffect } from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExportPdfButton({
  onClick,
  label = "PDF",
  className,
  disabled = false,
}) {
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName);

      // Alt + P como acceso rápido
      if (e.altKey && e.key.toLowerCase() === "p" && !isTyping && !disabled) {
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
        "h-9 px-3 border transition-all shadow-sm flex items-center justify-center gap-2 rounded-md font-bold text-[11px] uppercase tracking-tight",
        "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400",
        !disabled && "hover:bg-zinc-50 hover:border-zinc-300 active:scale-95",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <FileText 
        size={16} 
        className={cn(
          "transition-colors",
          !disabled ? "text-rose-600" : "text-zinc-400"
        )} 
      />
      <span className="hidden md:inline-block">
        {label}
      </span>
    </button>
  );
}