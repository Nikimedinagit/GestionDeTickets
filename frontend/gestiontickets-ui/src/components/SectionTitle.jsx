import React from "react";
import { cn } from "@/lib/utils";

export function SectionTitle({
  title,
  subtitle,
  icon: Icon,
  showLine = true,
  className,
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg
            border border-[#1e293b]/20
            bg-[#1e293b]
            text-white
            shadow-[0_10px_20px_-8px_rgba(30,41,59,0.4)]"
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-white/10 to-transparent opacity-40" />

            <Icon size={24} strokeWidth={2} className="relative z-10" />
          </div>
        )}

        <div className="flex flex-col min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-[#1e293b] dark:text-white leading-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="text-[15px] font-medium tracking-tight text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {showLine && (
        <div className="flex items-center gap-3 px-1 w-full">
          <div className="h-[2px] w-24 bg-gradient-to-r from-[#1e293b] to-[#1e293b]/30 rounded-full" />
          <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
          <div className="h-1 w-1.5 rounded-full bg-[#1e293b]/70 shadow-[0_0_8px_rgba(30,41,59,0.5)]" />
        </div>
      )}
    </div>
  );
}