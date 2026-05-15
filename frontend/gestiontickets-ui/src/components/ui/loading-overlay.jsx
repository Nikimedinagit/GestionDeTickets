export const LoadingOverlay = ({ isLoading, text = "Cargando datos..." }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 dark:bg-zinc-950/60 backdrop-blur-[2px] transition-all duration-500">
      <div className="relative flex flex-col items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#1e293b]/20 rounded-full blur-2xl animate-pulse" />

        <div className="relative animate-bounce-slow">
          <img
            src="/logo-tickets.png"
            alt="Cargando..."
            className="w-20 h-20 object-contain drop-shadow-[0_10px_10px_rgba(122,14,180,0.3)]"
          />
        </div>

        <span className="mt-4 text-[12px] font-black text-[#1e293b] uppercase tracking-[0.2em] drop-shadow-sm">
          {text}
        </span>

        <div className="mt-3 w-28 h-[2px] bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#1e293b] animate-progress-line" />
        </div>
      </div>
    </div>
  );
};