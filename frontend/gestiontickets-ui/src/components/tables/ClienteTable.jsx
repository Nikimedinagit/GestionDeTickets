import { SquarePen, Trash2, RotateCcw } from "lucide-react";
import { TableSearch } from "@/components/ui/table-search";
import { StatusToggle } from "@/components/ui/status-toggle";
import { Tooltip } from "@/components/ui/tooltip-custom";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

//** Opciones de filtro para el estado de los clientes, utilizadas en el componente StatusToggle. */
const statusOptions = [
  { id: "activos", label: "Activos" },
  { id: "inactivos", label: "Inactivos" },
];

export function ClientesTable({
  data = [],
  filter,
  onFilterChange,
  onEdit,
  onDelete,
  onRestore,
  searchTerm,
  onSearchChange,
  isLoading,
  onDetalleCliente,
}) {
  return (
    <div className="w-full mt-6 space-y-3 tracking-tight">
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between px-1">
        <StatusToggle
          value={filter}
          onChange={onFilterChange}
          options={statusOptions}
        />
        <TableSearch
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Escriba aquí para acotar la búsqueda..."
        />
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-md shadow-xl overflow-x-auto relative border border-zinc-100">
        <LoadingOverlay isLoading={isLoading} />

        <table className="w-full text-left border-collapse text-sm min-w-[700px]">
          <thead>
            <tr className="h-10 bg-[#1e293b]/[0.06] text-[#1e293b] uppercase tracking-[0.08em] font-bold border-b border-[#1e293b]/10">
              <th className="px-4 py-1 align-middle">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-[#1e293b] rounded-full" />
                  Nombre Completo
                </div>
              </th>
              <th className="px-4 py-1 align-middle">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-[#1e293b] rounded-full" />
                  Email
                </div>
              </th>
              <th className="px-4 py-1 align-middle">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-[#1e293b] rounded-full" />
                  Dni
                </div>
              </th>

              <th className="sticky right-0 z-10 px-4 py-1 text-center w-24 align-middle dark:bg-zinc-900 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)]"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {data.length > 0 ? (
              data.map((cliente) => (
                <tr
                  key={cliente.clienteID}
                  className="h-10 group hover:bg-[#1e293b]/[0.03] dark:hover:bg-zinc-900 transition-colors"
                >
                  <td className="px-4 py-1 align-middle">
                    <button
                      onClick={() => onDetalleCliente(cliente)}
                      className="font-semibold text-[#1e293b] uppercase hover:underline text-left"
                    >
                      {cliente.nombreCompleto}
                    </button>
                  </td>
                  <td className="px-4 py-1 align-middle">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-200 lowercase">
                      {cliente.email}
                    </span>
                  </td>
                  <td className="px-4 py-1 align-middle">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-200 uppercase">
                      {cliente.dni}
                    </span>
                  </td>

                  <td
                    className="sticky right-0 z-10 px-4 py-1 align-middle bg-white dark:bg-zinc-950 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.01)] 
                                group-hover:bg-[#f8f9fa] dark:group-hover:bg-[#121212] transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {filter === "activos" && (
                        <Tooltip text="Editar">
                          <button
                            onClick={() => onEdit(cliente)}
                            className="p-1.5 text-sky-500 rounded-md hover:bg-sky-50 transition"
                          >
                            <SquarePen size={18} />
                          </button>
                        </Tooltip>
                      )}

                      {filter === "activos" ? (
                        <Tooltip text="Eliminar">
                          <button
                            onClick={() => onDelete(cliente)}
                            className="p-1.5 text-rose-500 rounded-md hover:bg-rose-50 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </Tooltip>
                      ) : (
                        <Tooltip text="Restaurar">
                          <button
                            onClick={() => onRestore(cliente)}
                            className="p-1.5 text-emerald-500 rounded-md hover:bg-emerald-50 transition"
                          >
                            <RotateCcw size={18} />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
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
