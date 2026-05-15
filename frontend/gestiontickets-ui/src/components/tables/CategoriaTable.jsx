import { SquarePen, Trash2, RotateCcw } from "lucide-react";
import { TableSearch } from "@/components/ui/table-search";
import { StatusToggle } from "@/components/ui/status-toggle";
import { Tooltip } from "@/components/ui/tooltip-custom";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

//** Opciones de filtro para el estado de las categorias, utilizadas en el componente StatusToggle. */
const statusOptions = [
  { id: "activos", label: "Activos" },
  { id: "inactivos", label: "Inactivos" },
];

export function CategoriasTable({
  data = [],
  filter,
  onFilterChange,
  onEdit,
  onDelete,
  onRestore,
  searchTerm,
  onSearchChange,
  isLoading,
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

      <div className="bg-white dark:bg-zinc-950 rounded-md shadow-xl overflow-hidden">
        <LoadingOverlay isLoading={isLoading} />

        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="h-8 bg-[#1e293b]/[0.06] text-[#1e293b] uppercase tracking-[0.08em] font-bold border-b border-[#1e293b]/10">
              <th className="px-4 py-1 align-middle">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-[#1e293b] rounded-full" />
                  Nombre
                </div>
              </th>
              <th className="px-2 py-1 text-center w-16 align-middle"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {data.length > 0 ? (
              data.map((categoria) => (
                <tr
                  key={categoria.categoriaID}
                  className="h-8 group hover:bg-[#1e293b]/[0.06] dark:hover:bg-zinc-900 transition-colors"
                >
                  <td className="px-4 py-1 align-middle">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-200 uppercase">
                      {categoria.descripcion}
                    </span>
                  </td>

                  <td className="px-2 py-1 align-middle">
                    <div className="flex items-center justify-center gap-2 opacity-70 group-hover:opacity-100 transition">
                      {filter === "activos" && (
                        <Tooltip text="Editar">
                          <button
                            onClick={() => onEdit(categoria)}
                            className="p-1 text-sky-500 rounded-md hover:bg-sky-50 dark:hover:bg-sky-900/30 transition"
                          >
                            <SquarePen size={18} />
                          </button>
                        </Tooltip>
                      )}

                      {filter === "activos" ? (
                        <Tooltip text="Eliminar">
                          <button
                            onClick={() => onDelete(categoria)}
                            className="p-1 text-rose-500 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/30 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </Tooltip>
                      ) : (
                        <Tooltip text="Restaurar">
                          <button
                            onClick={() => onRestore(categoria)}
                            className="p-1 text-emerald-500 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition"
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
              <tr className="h-10">
                <td
                  colSpan="2"
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
