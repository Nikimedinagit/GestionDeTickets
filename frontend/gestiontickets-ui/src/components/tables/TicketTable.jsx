import { useState } from "react";
import { SquarePen, History, ListFilter } from "lucide-react";
import { TableSearch } from "@/components/ui/table-search";
import { StatusToggle } from "@/components/ui/status-toggle";
import { Tooltip } from "@/components/ui/tooltip-custom";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { FiltroTickets } from "@/components/filtros/FiltrosTickets";
import { Button } from "@/components/ui/button";
import { exportarTicketsPDF } from "@/lib/export/ticket-pdf";
import { ExportPdfButton } from "@/components/ExportPdfButton";

const statusOptions = [
  { id: "activos", label: "Activos" },
  { id: "finalizados", label: "Finalizados" },
];

const estadoNombres = {
  1: "ABIERTO",
  2: "EN PROCESO",
  3: "CERRADO",
  4: "CANCELADO",
};

const prioridadNombres = {
  1: "BAJA",
  2: "MEDIA",
  3: "ALTA",
};

const estadoStyles = {
  1: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 tracking-normal",
  2: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 tracking-normal",
  3: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 tracking-normal",
  4: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 tracking-normal",
};

const prioridadStyles = {
  1: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 tracking-normal",
  2: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 tracking-normal",
  3: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400 tracking-normal",
};

export function TicketTable({
  data = [],
  filter,
  onFilterChange,
  onEdit,
  onVerHistorial,
  onDetalleTicket,
  searchTerm,
  onSearchChange,
  isLoading,
  filtros,
  setFiltros,
  categoriasFiltro,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha)
      .toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  };

  const handleExport = () => {
    exportarTicketsPDF(data, {
      estadoVista: filter,
      busqueda: searchTerm,
      filtros,
      categorias: categoriasFiltro,
    });
  };

  return (
    <div className="w-full mt-6 space-y-3 tracking-tight">
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between px-1">
        <StatusToggle
          value={filter}
          onChange={onFilterChange}
          options={statusOptions}
        />

        <div className="flex items-center gap-2 w-full md:w-auto">
          <TableSearch
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Escriba aquí para acotar la búsqueda..."
          />

          <Tooltip text={showFilters ? "Ocultar" : "Filtros"}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-9 w-9 border transition-all shadow-sm flex items-center justify-center rounded-md ${
                showFilters
                  ? "bg-[#1e293b] text-white border-[#1e293b] hover:bg-[#1e293b]/90 hover:text-white"
                  : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <ListFilter size={16} />
            </Button>
          </Tooltip>

          <ExportPdfButton
            onClick={handleExport}
            disabled={data.length === 0 || isLoading}
          />
        </div>
      </div>

      <FiltroTickets
        isOpen={showFilters}
        onOpenChange={setShowFilters}
        filtros={filtros}
        setFiltros={setFiltros}
        categoriasFiltro={categoriasFiltro}
      />

      <div className="bg-white dark:bg-zinc-950 rounded-md shadow-xl overflow-x-auto relative border border-zinc-100">
        <LoadingOverlay isLoading={isLoading} />

        <table className="w-full text-left border-collapse text-sm min-w-[900px] table-fixed">
          <thead>
            <tr className="h-10 bg-[#1e293b]/[0.06] text-[#1e293b] uppercase tracking-[0.08em] font-bold border-b border-[#1e293b]/10">
              <th className="px-4 py-1 align-middle w-[140px]">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-[#1e293b] rounded-full" />
                  {filter === "activos" ? "Creación" : "Cerrado"}
                </div>
              </th>
              <th className="px-4 py-1 align-middle">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-[#1e293b] rounded-full" />
                  Título
                </div>
              </th>
              <th className="px-4 py-1 align-middle w-[250px]">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-[#1e293b] rounded-full" />
                  Categoría
                </div>
              </th>
              <th className="px-4 py-1 align-middle w-[125px]">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-[#1e293b] rounded-full" />
                  Estado
                </div>
              </th>
              <th className="px-4 py-1 align-middle w-[120px]">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-[#1e293b] rounded-full" />
                  Prioridad
                </div>
              </th>
              <th className="sticky right-0 z-10 px-4 py-1 text-center w-[100px] align-middle dark:bg-zinc-900 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)]"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {data.length > 0 ? (
              data.map((ticket) => (
                <tr
                  key={ticket.ticketID}
                  className="h-10 group hover:bg-[#1e293b]/[0.03] dark:hover:bg-zinc-900 transition-colors"
                >
                  <td className="px-4 py-1 align-middle text-zinc-500 font-medium">
                    {formatFecha(
                      filter === "activos"
                        ? ticket.fechaDeCreacion
                        : ticket.fechaDeCierre,
                    )}
                  </td>

                  <td className="px-4 py-1 align-middle">
                    <button
                      onClick={() => onDetalleTicket(ticket)}
                      title={ticket.titulo}
                      className="font-semibold text-[#1e293b] uppercase hover:underline text-left leading-tight block w-full truncate overflow-hidden whitespace-nowrap"
                    >
                      {ticket.titulo}
                    </button>
                  </td>

                  <td className="px-4 py-1 align-middle">
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium uppercase truncate block">
                      {ticket.categoria?.descripcion || "General"}
                    </span>
                  </td>

                  <td className="px-4 py-1 align-middle">
                    <span
                      className={`inline-flex items-center px-2 py-0.2 rounded-md text-[12px] font-bold border uppercase ${estadoStyles[ticket.estado] || "bg-zinc-100"}`}
                    >
                      {estadoNombres[ticket.estado] || "DESCONOCIDO"}
                    </span>
                  </td>

                  <td className="px-4 py-1 align-middle">
                    <span
                      className={`inline-flex items-center px-2 py-0.2 rounded-md text-[12px] font-bold border uppercase ${prioridadStyles[ticket.prioridad] || "bg-zinc-100"}`}
                    >
                      {prioridadNombres[ticket.prioridad] || "DESCONOCIDO"}
                    </span>
                  </td>

                  <td className="sticky right-0 z-10 px-4 py-1 align-middle bg-white dark:bg-zinc-950 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.01)] group-hover:bg-[#f8f9fa] dark:group-hover:bg-[#121212] transition-colors">
                    <div className="flex items-center justify-center gap-2">
                      {ticket.estado === 1 && (
                        <Tooltip text="Editar">
                          <button
                            onClick={() => onEdit(ticket)}
                            className="p-1.5 text-sky-500 rounded-md hover:bg-sky-50 transition"
                          >
                            <SquarePen size={18} />
                          </button>
                        </Tooltip>
                      )}
                      <Tooltip text="Historial">
                        <button
                          onClick={() => onVerHistorial(ticket)}
                          className="p-1.5 text-amber-500 rounded-md hover:bg-amber-50 transition"
                        >
                          <History size={18} />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-2 text-center text-zinc-400 font-medium"
                >
                  No se encontraron datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
