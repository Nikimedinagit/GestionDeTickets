import { LoadingOverlay } from "@/components/ui/loading-overlay";

export function TicketsDesarrolladorCategoriaTable({ data = [], isLoading }) {
  return (
    <div className="w-full mt-6 space-y-3 tracking-tight">
      <div className="bg-white dark:bg-zinc-950 rounded-md shadow-xl overflow-x-auto relative border border-zinc-100 dark:border-zinc-900">
        <LoadingOverlay isLoading={isLoading} />

        <table className="w-full text-left border-collapse text-sm min-w-[950px] table-fixed">
          <thead>
            <tr className="h-10 bg-[#1e293b]/[0.06] text-[#1e293b] dark:text-zinc-200 uppercase tracking-[0.08em] font-bold border-b border-[#1e293b]/10 dark:border-zinc-800">
              <th className="px-4 py-1 align-middle pl-6">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-[#1e293b] dark:bg-zinc-400 rounded-full" />
                  Desarrollador / Categoría
                </div>
              </th>
              <th className="px-4 py-1 align-middle text-center w-[110px]">Cerrados</th>
              <th className="px-4 py-1 align-middle text-center w-[110px]">Bajos</th>
              <th className="px-4 py-1 align-middle text-center w-[110px]">Medios</th>
              <th className="px-4 py-1 align-middle text-center w-[110px]">Críticos</th>
              <th className="px-4 py-1 align-middle text-center w-[200px]">Último Cerrado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {data.length > 0 ? (
              data.map((desarrollador) => (
                <tr key={`desarrollador-${desarrollador.desarrolladorId}`}>
                  <td colSpan="6" className="p-0">
                    <table className="w-full table-fixed border-collapse">
                      <tbody>
                        <tr className="bg-zinc-100 dark:bg-zinc-900/60 font-bold text-zinc-800 dark:text-zinc-200 h-10">
                          <td className="px-4 py-1 align-middle pl-6 truncate">{desarrollador.nombre}</td>
                          <td className="px-4 py-1 align-middle text-center w-[110px]">{desarrollador.totalTicketsCerrados}</td>
                          <td className="px-4 py-1 align-middle text-center w-[110px]">{desarrollador.porcentajeBajos}%</td>
                          <td className="px-4 py-1 align-middle text-center w-[110px]">{desarrollador.porcentajeIntermedios}%</td>
                          <td className="px-4 py-1 align-middle text-center w-[110px]">{desarrollador.porcentajeCriticos}%</td>
                          <td className="px-4 py-1 align-middle text-center w-[200px]">
                            {desarrollador.ultimoTicketCreado ? (
                              <span className="inline-block px-2 py-0.5 rounded-md text-[13px] font-bold bg-emerald-100/60 text-emerald-700 dark:bg-emerald-900/35 dark:text-emerald-400">
                                {desarrollador.ultimoTicketCreado}
                              </span>
                            ) : (
                              <span className="text-zinc-400 dark:text-zinc-600 font-medium text-[13px]">Aún no tiene</span>
                            )}
                          </td>
                        </tr>

                        {desarrollador.categorias?.map((cat) => (
                          <tr 
                            key={`cat-${desarrollador.desarrolladorId}-${cat.categoriaId}`}
                            className="h-10 font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors border-b border-zinc-100 dark:border-zinc-900"
                          >
                            <td className="px-4 py-1 align-middle pl-12 uppercase font-semibold text-[13px] truncate">
                              {cat.nombre}
                            </td>
                            <td className="px-4 py-1 align-middle text-center text-zinc-500 dark:text-zinc-500">{cat.totalTicketsCerrados}</td>
                            <td className="px-4 py-1 align-middle text-center text-zinc-500 dark:text-zinc-500">{cat.porcentajeBajos}%</td>
                            <td className="px-4 py-1 align-middle text-center text-zinc-500 dark:text-zinc-500">{cat.porcentajeIntermedios}%</td>
                            <td className="px-4 py-1 align-middle text-center text-zinc-500 dark:text-zinc-500">{cat.porcentajeCriticos}%</td>
                            <td className="px-4 py-1 align-middle text-center">
                              {cat.ultimoTicketCreado ? (
                                <span className="inline-block px-2 py-0.5 rounded-md text-[13px] font-bold bg-sky-100/60 text-sky-700 dark:bg-sky-900/35 dark:text-sky-400">
                                  {cat.ultimoTicketCreado}
                                </span>
                              ) : (
                                <span className="text-zinc-400 dark:text-zinc-600 font-medium text-[13px]">Aún no tiene</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-zinc-400 font-medium">
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