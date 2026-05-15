import { RotateCcw, Filter, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function FiltroFechasEstadistica({
  isOpen,
  onOpenChange,
  filtros = {},
  setFiltros,
}) {
  const handleDateChange = (name, date) => {
    setFiltros((prev) => ({ ...prev, [name]: date }));
  };

  const limpiarFiltros = () => {
    setFiltros({ FechaInicio: null, FechaFin: null });
  };

  const tieneFiltrosActivos = Boolean(filtros?.FechaInicio || filtros?.FechaFin);

  const focusStyles = "focus:ring-2 focus:ring-zinc-200 focus-visible:ring-zinc-200 outline-none transition-all";

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} className="w-full">
      <CollapsibleContent className="space-y-4 overflow-hidden transition-all data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-zinc-100 dark:border-zinc-900 pb-2">
            <Filter size={14} className="text-zinc-400" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1e293b] dark:text-zinc-400">
              Filtros de Búsqueda
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold ml-1 text-zinc-700 dark:text-zinc-300">Fecha Desde</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("h-9 w-full justify-start text-[11px] uppercase border-zinc-200 dark:border-zinc-800 bg-white dark:bg-transparent", focusStyles)}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                    {filtros?.FechaInicio ? format(filtros.FechaInicio, "dd/MM/yy", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white dark:bg-zinc-950 w-auto p-0 shadow-2xl border-zinc-200 dark:border-zinc-800" align="start">
                  <Calendar mode="single" selected={filtros?.FechaInicio} onSelect={(d) => handleDateChange("FechaInicio", d)} locale={es} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold ml-1 text-zinc-700 dark:text-zinc-300">Fecha Hasta</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("h-9 w-full justify-start text-[11px] uppercase border-zinc-200 dark:border-zinc-800 bg-white dark:bg-transparent", focusStyles)}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                    {filtros?.FechaFin ? format(filtros.FechaFin, "dd/MM/yy", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white dark:bg-zinc-950 w-auto p-0 shadow-2xl border-zinc-200 dark:border-zinc-800" align="start">
                  <Calendar mode="single" selected={filtros?.FechaFin} onSelect={(d) => handleDateChange("FechaFin", d)} locale={es} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {tieneFiltrosActivos && (
            <div className="flex justify-end pt-3 border-t border-zinc-100 dark:border-zinc-900 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={limpiarFiltros}
                className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold rounded-md px-3 h-8 text-[10px] uppercase gap-2"
              >
                <RotateCcw size={12} /> Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}