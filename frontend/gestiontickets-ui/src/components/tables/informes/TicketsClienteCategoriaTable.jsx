import { LoadingOverlay } from "@/components/ui/loading-overlay";

export function TicketsClienteCategoriaTable({ data = [], isLoading }) {
  return (
    <div className="w-full mt-6 space-y-3 tracking-tight">
      <div className="bg-white dark:bg-zinc-950 rounded-md shadow-xl overflow-x-auto relative border border-zinc-100 dark:border-zinc-900">
        <LoadingOverlay isLoading={isLoading} />

        <table className="w-full text-left border-collapse text-sm min-w-[900px] table-fixed">
          <thead>
            <tr className="h-10 bg-[#1e293b]/[0.06] text-[#1e293b] dark:text-zinc-200 uppercase tracking-[0.08em] font-bold border-b border-[#1e293b]/10 dark:border-zinc-800">
              <th className="px-4 py-1 align-middle pl-6">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-[#1e293b] dark:bg-zinc-400 rounded-full" />
                  Cliente / Categoría
                </div>
              </th>
              <th className="px-4 py-1 align-middle text-center w-[100px]">Total</th>
              <th className="px-4 py-1 align-middle text-center w-[120px]">Abiertos</th>
              <th className="px-4 py-1 align-middle text-center w-[120px]">Cerrados</th>
              <th className="px-4 py-1 align-middle text-center w-[110px]">Críticos</th>
              <th className="px-4 py-1 align-middle text-center w-[180px]">Último Creado</th>
              <th className="px-4 py-1 align-middle text-center w-[180px]">Último Cerrado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {data.length > 0 ? (
              data.map((cliente) => (
                <tr key={`cliente-${cliente.clienteId}`}>
                  <td colSpan="7" className="p-0">
                    <table className="w-full table-fixed border-collapse">
                      <tbody>
                        <tr className="bg-zinc-100 dark:bg-zinc-900/60 font-bold text-zinc-800 dark:text-zinc-200 h-10">
                          <td className="px-4 py-1 align-middle pl-6 truncate">{cliente.nombre}</td>
                          <td className="px-4 py-1 align-middle text-center w-[100px]">{cliente.totalTickets}</td>
                          <td className="px-4 py-1 align-middle text-center w-[120px]">{cliente.ticketsAbiertos}</td>
                          <td className="px-4 py-1 align-middle text-center w-[120px]">{cliente.ticketsCerrados}</td>
                          <td className="px-4 py-1 align-middle text-center w-[110px]">{cliente.porcentajeCriticos}%</td>
                          <td className="px-4 py-1 align-middle text-center w-[180px]">
                            {cliente.ultimoTicketCreado ? (
                              <span className="inline-block px-2 py-0.5 rounded-md text-[13px] font-bold bg-sky-100/60 text-sky-700 dark:bg-sky-900/35 dark:text-sky-400">
                                {cliente.ultimoTicketCreado}
                              </span>
                            ) : (
                              <span className="text-zinc-400 dark:text-zinc-600 font-medium text-[13px]">Aún no tiene</span>
                            )}
                          </td>
                          <td className="px-4 py-1 align-middle text-center w-[180px]">
                            {cliente.ultimoTicketCerrado ? (
                              <span className="inline-block px-2 py-0.5 rounded-md text-[13px] font-bold bg-emerald-100/60 text-emerald-700 dark:bg-emerald-900/35 dark:text-emerald-400">
                                {cliente.ultimoTicketCerrado}
                              </span>
                            ) : (
                              <span className="text-zinc-400 dark:text-zinc-600 font-medium text-[13px]">Aún no tiene</span>
                            )}
                          </td>
                        </tr>

                        {cliente.categorias?.map((cat) => (
                          <tr 
                            key={`cat-${cliente.clienteId}-${cat.categoriaId}`}
                            className="h-10 font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors border-b border-zinc-100 dark:border-zinc-900"
                          >
                            <td className="px-4 py-1 align-middle pl-12 uppercase font-semibold text-[13px] truncate">
                              {cat.descripcion}
                            </td>
                            <td className="px-4 py-1 align-middle text-center text-zinc-500 dark:text-zinc-500">{cat.totalTickets}</td>
                            <td className="px-4 py-1 align-middle text-center text-zinc-500 dark:text-zinc-500">{cat.ticketsAbiertos}</td>
                            <td className="px-4 py-1 align-middle text-center text-zinc-500 dark:text-zinc-500">{cat.ticketsCerrados}</td>
                            <td className="px-4 py-1 align-middle text-center text-zinc-500 dark:text-zinc-500">{cat.porcentajeCriticos}%</td>
                            <td className="px-4 py-1 align-middle text-center">
                              {cat.ultimoTicketCreado ? (
                                <span className="inline-block px-2 py-0.5 rounded-md text-[13px] font-bold bg-sky-100/60 text-sky-700 dark:bg-sky-900/35 dark:text-sky-400">
                                  {cat.ultimoTicketCreado}
                                </span>
                              ) : (
                                <span className="text-zinc-400 dark:text-zinc-600  font-medium text-[13px]">Aún no tiene</span>
                              )}
                            </td>
                            <td className="px-4 py-1 align-middle text-center">
                              {cat.ultimoTicketCerrado ? (
                                <span className="inline-block px-2 py-0.5 rounded-md text-[13px] font-bold bg-emerald-100/60 text-emerald-700 dark:bg-emerald-900/35 dark:text-emerald-400">
                                  {cat.ultimoTicketCerrado}
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
                <td colSpan="7" className="px-4 py-2 text-center text-zinc-400 font-medium">
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