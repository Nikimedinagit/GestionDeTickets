import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

export function HistorialTicketsModal({ isOpen, onClose, ticket, historial = [] }) {
  
  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleString("es-AR");
  };

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95%] sm:max-w-[950px] 
               bg-white rounded-md border-none p-0 shadow-2xl 
               h-auto max-h-[90vh] flex flex-col 
               overflow-hidden
               [&>button]:hidden"
      >
        <DialogHeader className="p-3 shrink-0">
          <DialogTitle className="text-[#1e293b] flex items-center gap-3 text-lg sm:text-xl font-extrabold tracking-tight">
            <div className="bg-[#1e293b]/10 p-2 rounded-lg shrink-0">
              <History size={22} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span>Historial de Cambios</span>
              <span className="text-[#334155] font-bold text-sm sm:text-base truncate max-w-[200px] sm:max-w-full">
                "{ticket.titulo}"
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="px-3 pb-3 pt-3 space-y-4 border-t border-zinc-100 bg-zinc-50/50 flex-1 overflow-hidden flex flex-col">
          
          <div className="bg-white rounded-md shadow-xl border border-zinc-100 flex flex-col overflow-hidden">
            <div className="overflow-y-auto max-h-[300px] sm:max-h-[400px]">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr className="h-8 bg-[#1e293b]/[0.06] text-[#1e293b] uppercase tracking-[0.08em] font-bold border-b border-[#1e293b]/10">
                    <th className="px-4 py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-0.5 h-3 bg-[#1e293b] rounded-full" />
                        Campo
                      </div>
                    </th>
                    <th className="px-4 py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-0.5 h-3 bg-[#1e293b] rounded-full" />
                        Valor Anterior
                      </div>
                    </th>
                    <th className="px-4 py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-0.5 h-3 bg-[#1e293b] rounded-full" />
                        Valor Nuevo
                      </div>
                    </th>
                    <th className="px-4 py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-0.5 h-3 bg-[#1e293b] rounded-full" />
                        Fecha
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100">
                  {historial.length > 0 ? (
                    historial.map((h) => (
                      <tr
                        key={h.historialTicketID}
                        className="h-8 group hover:bg-[#1e293b]/[0.06] transition-colors"
                      >
                        <td className="px-4 py-1">
                          <span className="font-semibold text-zinc-700 uppercase text-[11px] sm:text-xs">
                            {h.campoModificado}
                          </span>
                        </td>
                        <td className="px-4 py-1">
                          <span className="font-semibold text-zinc-700 uppercase text-[11px] sm:text-xs">
                          {h.valorAnterior || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-1">
                          <span className="font-semibold text-zinc-700 uppercase text-[11px] sm:text-xs">
                            {h.valorNuevo}
                          </span>
                        </td>
                        <td className="px-4 py-1">
                          <span className="font-semibold text-zinc-700 uppercase text-[11px] sm:text-xs">
                          {formatFecha(h.fechaCambio)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-2 text-center text-zinc-400 font-medium"
                      >
                        No hay movimientos registrados para este ticket.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-2 shrink-0">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full sm:w-auto bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold rounded-md px-8 h-9 active:scale-95"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}