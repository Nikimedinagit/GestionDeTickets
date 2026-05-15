import { RotateCcw, Filter, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function FiltroTickets({
  isOpen,
  onOpenChange,
  filtros = {},
  setFiltros,
  categoriasFiltro = [],
}) {
  const handleSelectChange = (name, value) => {
    if (!setFiltros) return;
    setFiltros((prev) => ({
      ...prev,
      [name]: value === "all" ? null : parseInt(value),
    }));
  };

  const handleDateChange = (name, date) => {
    if (!setFiltros) return;
    setFiltros((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const tieneFiltrosActivos = Boolean(
    filtros &&
    (filtros.CategoriaID ||
      filtros.Estado ||
      filtros.Prioridad ||
      filtros.FechaInicio ||
      filtros.FechaFin),
  );

  const limpiarFiltros = () => {
    if (!setFiltros) return;
    setFiltros({
      CategoriaID: null,
      Estado: null,
      Prioridad: null,
      FechaInicio: null,
      FechaFin: null,
    });
  };

  const focusStyles =
    "focus:ring-2 focus:ring-zinc-200 focus-visible:ring-zinc-200 outline-none transition-all";

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

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold ml-1 text-zinc-700">
                Categoría
              </Label>
              <Select
                value={filtros?.CategoriaID?.toString() || "all"}
                onValueChange={(val) => handleSelectChange("CategoriaID", val)}
              >
                <SelectTrigger
                  className={cn(
                    "h-9 bg-white border-zinc-200 text-xs uppercase font-medium",
                    focusStyles,
                  )}
                >
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent className="bg-white text-xs uppercase">
                  <SelectItem value="all">Todas</SelectItem>
                  {categoriasFiltro?.map((cat) => (
                    <SelectItem
                      key={cat.categoriaID}
                      value={cat.categoriaID.toString()}
                    >
                      {cat.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold ml-1 text-zinc-700">
                Estado
              </Label>
              <Select
                value={filtros?.Estado?.toString() || "all"}
                onValueChange={(val) => handleSelectChange("Estado", val)}
              >
                <SelectTrigger
                  className={cn(
                    "h-9 bg-white border-zinc-200 text-xs uppercase",
                    focusStyles,
                  )}
                >
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-white text-xs uppercase">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1">Abierto</SelectItem>
                  <SelectItem value="2">En Proceso</SelectItem>
                  <SelectItem value="3">Cerrado</SelectItem>
                  <SelectItem value="4">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold ml-1 text-zinc-700">
                Prioridad
              </Label>
              <Select
                value={filtros?.Prioridad?.toString() || "all"}
                onValueChange={(val) => handleSelectChange("Prioridad", val)}
              >
                <SelectTrigger
                  className={cn(
                    "h-9 bg-white border-zinc-200 text-xs uppercase",
                    focusStyles,
                  )}
                >
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent className="bg-white text-xs uppercase">
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="1">Baja</SelectItem>
                  <SelectItem value="2">Media</SelectItem>
                  <SelectItem value="3">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold ml-1 text-zinc-700">
                Rango de Fecha
              </Label>
              <div className="flex flex-row gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-start text-[11px] uppercase border-zinc-200 bg-white",
                        focusStyles,
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                      {filtros?.FechaInicio
                        ? format(filtros.FechaInicio, "dd/MM/yy", {
                            locale: es,
                          })
                        : "Desde"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="bg-white w-auto p-0 shadow-2xl border-none"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={filtros?.FechaInicio}
                      onSelect={(date) => handleDateChange("FechaInicio", date)}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-start text-[11px] uppercase border-zinc-200 bg-white",
                        focusStyles,
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                      {filtros?.FechaFin
                        ? format(filtros.FechaFin, "dd/MM/yy", { locale: es })
                        : "Hasta"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="bg-white w-auto p-0 shadow-2xl border-none"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={filtros?.FechaFin}
                      onSelect={(date) => handleDateChange("FechaFin", date)}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {tieneFiltrosActivos && (
            <div className="flex justify-end pt-3 border-t border-zinc-100 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={limpiarFiltros}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold rounded-md px-3 h-8 active:scale-95 transition-all text-[10px] uppercase gap-2"
              >
                <RotateCcw size={12} />
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
