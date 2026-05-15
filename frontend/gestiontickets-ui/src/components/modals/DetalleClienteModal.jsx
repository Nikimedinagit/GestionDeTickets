import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Users, Mail, Fingerprint, Phone, FileText } from "lucide-react";

export function ClientesDetalleModal({ isOpen, onClose, cliente }) {
  if (!cliente) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95%] sm:max-w-[700px] 
               bg-white rounded-md border-none p-0 shadow-2xl 
               flex flex-col overflow-hidden
               [&>button]:hidden"
      >
        <DialogHeader className="p-3">
          <DialogTitle className="text-[#1e293b] flex items-center gap-3 text-lg sm:text-xl font-extrabold tracking-tight">
            <div className="bg-[#1e293b]/10 p-2 rounded-lg shrink-0 text-[#1e293b]">
              <Users size={22} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span>Detalle del Cliente</span>
              <span className="text-[#334155] font-bold text-sm sm:text-base truncate max-w-[250px] sm:max-w-full">
                "{cliente.nombreCompleto}"
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4 pt-4 space-y-6 border-t border-zinc-100 bg-zinc-50/50">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
                  <Fingerprint size={14} /> Numero de DNI
                </Label>
                <p className="text-[#1e293b] font-bold text-base tracking-tight">
                  {cliente.dni}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
                  <Mail size={14} /> Correo Electrónico
                </Label>
                <p className="text-[#1e293b] font-semibold text-base lowercase">
                  {cliente.email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
                  <Phone size={14} /> Teléfono de Contacto
                </Label>
                <p className="text-[#1e293b] font-bold text-base">
                  {cliente.telefono || "NO REGISTRADO"}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
                  <Users size={14} /> Nombre Completo
                </Label>
                <p className="text-[#1e293b] font-bold text-base uppercase">
                  {cliente.nombreCompleto}
                </p>
              </div>
            </div>

          </div>

          <div className="flex flex-col gap-1 pt-2 border-t border-zinc-200/50">
            <Label className="text-[11px] uppercase font-bold text-zinc-500 flex items-center gap-2">
              <FileText size={14} /> Observaciones Internas
            </Label>
            <p className="text-zinc-600 text-sm leading-relaxed uppercase font-medium">
              {cliente.observacion || "EL CLIENTE NO POSEE OBSERVACIONES REGISTRADAS."}
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full sm:w-auto bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold rounded-md px-8 h-9 active:scale-95 transition-all shadow-sm"
            >
              Cerrar
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}