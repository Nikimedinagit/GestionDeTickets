import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Ticket,
  Calendar,
  Flag,
  Tag,
  FileText,
  MessageSquare,
  User,
} from "lucide-react";

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
  1: "bg-sky-100 text-sky-700 border",
  2: "bg-violet-100 text-violet-700 border",
  3: "bg-emerald-100 text-emerald-700 border",
  4: "bg-rose-100 text-rose-700 border",
};

const prioridadStyles = {
  1: "bg-zinc-100 text-zinc-700 border",
  2: "bg-amber-100 text-amber-700 border",
  3: "bg-fuchsia-100 text-fuchsia-700 border",
};

export function TicketDetalleModal({
  isOpen,
  onClose,
  ticket,
  rolUsuario,
  onCancelar,
  onIniciar,
  onCerrar,
}) {
  const [comentario, setComentario] = useState("");

  if (!ticket) return null;

  const formatFecha = (fecha) => {
    if (!fecha) return "NO REGISTRADA";
    return new Date(fecha).toLocaleString("es-AR");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95%] sm:max-w-[750px] 
        bg-white rounded-md border-none p-0 shadow-2xl 
        flex flex-col overflow-hidden
        [&>button]:hidden"
      >
        <DialogHeader className="p-3">
          <DialogTitle className="text-[#1e293b] flex items-center gap-3 text-lg sm:text-xl font-extrabold tracking-tight">
            <div className="bg-[#1e293b]/10 p-2 rounded-lg shrink-0 text-[#1e293b]">
              <Ticket size={22} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span>Detalle del Ticket</span>

              <span className="text-[#334155] font-bold text-sm sm:text-base truncate max-w-[250px] sm:max-w-full">
                "{ticket.titulo}"
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4 pt-4 space-y-6 border-t border-zinc-100 bg-zinc-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
                  <Tag size={14} /> Categoría
                </Label>

                <p className="text-[#1e293b] font-bold text-base uppercase">
                  {ticket.categoria?.descripcion}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
                  <Flag size={14} /> Prioridad
                </Label>

                <span
                  className={`inline-flex w-fit items-center px-2 py-0.2 rounded-md text-[12px] font-bold border uppercase ${prioridadStyles[ticket.prioridad]}`}
                >
                  {prioridadNombres[ticket.prioridad]}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
                  <Calendar size={14} /> Fecha de creación
                </Label>

                <p className="text-[#1e293b] font-semibold">
                  {formatFecha(ticket.fechaDeCreacion)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
                  <Calendar size={14} /> Fecha de comienzo
                </Label>

                <p className="text-[#1e293b] font-semibold">
                  {formatFecha(ticket.fechaDeComienzo)}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
                  <Calendar size={14} /> Fecha de cierre
                </Label>

                <p className="text-[#1e293b] font-semibold">
                  {formatFecha(ticket.fechaDeCierre)}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
                  <Flag size={14} /> Estado
                </Label>

                <span
                  className={`inline-flex w-fit items-center px-2 py-0.2 rounded-md text-[12px] font-bold border uppercase ${estadoStyles[ticket.estado]}`}
                >
                  {estadoNombres[ticket.estado]}
                </span>
              </div>
            </div>
          </div>

          {(ticket.estado === 3 || ticket.estado === 4) &&
            ticket.usuarioFinalizador && (
              <div className="flex flex-col gap-1 pt-2 border-t border-zinc-200/50">
                <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
                  <User size={14} /> Finalizado por
                </Label>

                <p className="text-[#1e293b] font-bold text-sm uppercase">
                  {ticket.usuarioFinalizador.nombreCompleto}
                </p>

                <p className="text-zinc-500 text-xs lowercase">
                  {ticket.usuarioFinalizador.email}
                </p>
              </div>
            )}

          <div className="flex flex-col gap-1 pt-2 border-t border-zinc-200/50">
            <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
              <FileText size={14} /> Descripción del Ticket
            </Label>

            <p className="text-zinc-600 text-sm leading-relaxed uppercase font-medium">
              {ticket.descripcion ||
                "EL TICKET NO POSEE DESCRIPCIÓN REGISTRADA."}
            </p>
          </div>

          {ticket.comentarios?.length > 0 && (
            <div className="flex flex-col gap-3 pt-4 border-t border-zinc-200/50">
              <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
                <MessageSquare size={14} /> Comentario
              </Label>

              <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-2">
                {ticket.comentarios.map((c, index) => (
                  <div
                    key={index}
                    className="bg-white border border-zinc-200 rounded-md p-3 flex flex-col gap-1 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="font-bold uppercase">
                        {c.applicationUser?.nombreCompleto || "USUARIO"}
                      </span>

                      <span>{formatFecha(c.fecha)}</span>
                    </div>

                    <p className="text-sm text-zinc-700 uppercase leading-relaxed">
                      {c.mensaje}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {((rolUsuario === "CLIENTE" && ticket.estado == 1) ||
            (rolUsuario === "ADMINISTRADOR" && ticket.estado === 1) ||
            (rolUsuario === "DESARROLLADOR" && ticket.estado === 2)) && (
            <div className="flex flex-col gap-1">
              <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
                <MessageSquare size={14} /> Comentario
              </Label>

              <Textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escriba un comentario..."
                className="text-sm rounded-md bg-white border focus-visible:ring-2 outline-none transition-all resize-none shadow-sm uppercase border-zinc-200 focus-visible:ring-zinc-200"
              />
            </div>
          )}

          <div className="flex justify-between pt-2">
            <div className="flex gap-2">
              {(rolUsuario === "CLIENTE" || rolUsuario === "ADMINISTRADOR") &&
                ticket.estado === 1 && (
                  <Button
                    onClick={() =>
                      onCancelar(ticket.ticketID, ticket.titulo, comentario)
                    }
                    className="bg-rose-100 hover:bg-rose-200 text-rose-700 text-[12px] border font-extrabold"
                  >
                    CANCELAR TICKET
                  </Button>
                )}

              {rolUsuario === "DESARROLLADOR" && ticket.estado === 1 && (
                <Button
                  onClick={() => onIniciar(ticket.ticketID, ticket.titulo)}
                  className="bg-violet-100 hover:bg-violet-200 text-violet-700 text-[12px] border font-extrabold"
                >
                  INICIAR PROCESO
                </Button>
              )}

              {rolUsuario === "DESARROLLADOR" && ticket.estado === 2 && (
                <Button
                  onClick={() =>
                    onCerrar(ticket.ticketID, ticket.titulo, comentario)
                  }
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-[12px] border font-extrabold"
                >
                  CERRAR TICKET
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              onClick={onClose}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold rounded-md px-8 h-9"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
