import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Network, Pencil } from "lucide-react";
import { notify } from "@/lib/notificaciones";

export function PuestosFormModal({
  isOpen,
  onClose,
  onSave,
  puestoAEditar = null,
}) {
  const [descripcion, setDescripcion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  //** useEffect para cargar los datos de las puestos a editar cuando se abre el modal, o limpiar el formulario si no hay puestos o se cierra el modal. */
  useEffect(() => {
    if (puestoAEditar && isOpen) {
      setDescripcion(puestoAEditar.descripcion);
    } else if (!isOpen) {
      setDescripcion("");
    }
  }, [puestoAEditar, isOpen]);

  //** Función para manejar el cierre del modal, reseteando el formulario y los errores. */
  const handleClose = () => {
    setDescripcion("");
    setError("");
    onClose();
  };

  const validate = () => {
    const newErrors = {};
    if (!descripcion.trim()) newErrors.descripcion = "Campo obligatorio";
    else if (descripcion.trim().length < 3)
      newErrors.descripcion = "Mínimo 3 caracteres";

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //** Función para manejar el envío del formulario, validando los datos y llamando a la función onSave. */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setError("");
    setIsSubmitting(true);

    try {
      await onSave({
        ...puestoAEditar,
        descripcion: descripcion.trim().toUpperCase(),
        estado: puestoAEditar ? puestoAEditar.estado : true,
      });

      notify(
        puestoAEditar
          ? "¡Puesto actualizado correctamente!"
          : "¡Puesto guardado correctamente!",
        descripcion.trim().toUpperCase(),
        "success",
      );

      setDescripcion("");
      onClose();
    } catch (err) {
      const serverMessage =
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        "Error al procesar";

      const lowerMessage = serverMessage.toLowerCase();

      if (
        lowerMessage.includes("descripcion") ||
        lowerMessage.includes("registra")
      ) {
        setError({ descripcion: serverMessage });
      } else {
        setError({ descripcion: serverMessage });
      }
      console.error("Error al guardar:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[400px] bg-white rounded-md border-none p-0 overflow-hidden shadow-2xl [&>button]:hidden">
        <DialogHeader className="p-3">
          <DialogTitle className="text-[#1e293b] flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <div className="bg-[#1e293b]/10 p-2 rounded-lg">
              {puestoAEditar ? <Pencil size={22} /> : <Network size={22} />}
            </div>
            {puestoAEditar ? "Editar Puesto" : "Nueva Puesto"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="px-3 pb-3 space-y-2 bg-zinc-50/50 pt-2 border-t border-zinc-100"
        >
          <div className="space-y-1.5 px-1">
            <Label
              htmlFor="name"
              className={`text-[14px] font-semibold ml-1 transition-colors ${error.descripcion ? "text-red-500" : "text-zinc"}`}
            >
              Nombre *
            </Label>
            <Input
              id="name"
              placeholder="Ej: INFRAESTRUCTURA"
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                if (error.descripcion) setError({ ...error, descripcion: "" });
              }}
              disabled={isSubmitting}
              className={`h-10 rounded-md bg-white shadow-sm transition-all outline-none focus-visible:ring-2 uppercase ${
                error.descripcion
                  ? "border-red-400 focus-visible:ring-red-100 focus-visible:border-red-500"
                  : "border-zinc-200 focus-visible:ring-zinc-200 focus-visible:border-zinc-400"
              }`}
            />

            {error.descripcion && (
              <p className="text-red-500 text-[12px] font-bold ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
                {error.descripcion}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 pb-1">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold rounded-md px-4 h-9 active:scale-95 transition-colors"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="bg-[#1e293b] hover:bg-[#334155] text-white font-bold rounded-md px-4 h-9 shadow-lg shadow-[#1e293b]/20 active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : puestoAEditar ? (
                "Actualizar"
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
