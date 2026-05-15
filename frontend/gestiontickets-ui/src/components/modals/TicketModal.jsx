import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Ticket, Pencil } from "lucide-react";
import { notify } from "@/lib/notificaciones";

export function TicketsFormModal({
  isOpen,
  onClose,
  onSave,
  categorias = [],
  ticketAEditar = null,
}) {
  const [formData, setFormData] = useState({
    titulo: "",
    categoriaID: "",
    prioridad: "",
    descripcion: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (ticketAEditar && isOpen) {
      setFormData({
        titulo: ticketAEditar.titulo || "",
        categoriaID: ticketAEditar.categoriaID?.toString() || "",
        prioridad: ticketAEditar.prioridad?.toString() || "",
        descripcion: ticketAEditar.descripcion || "",
      });
    } else if (!isOpen) {
      setFormData({
        titulo: "",
        categoriaID: "",
        prioridad: "",
        descripcion: "",
      });
      setErrors({});
    }
  }, [ticketAEditar, isOpen]);

  const handleClose = () => {
    onClose();
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.titulo.trim())
      newErrors.titulo = "Campo obligatorio";
    else if (formData.titulo.trim().length < 3)
      newErrors.titulo = "Mínimo 3 caracteres";

    if (!formData.categoriaID) newErrors.categoriaID = "Campo obligatorio";
    if (!formData.prioridad) newErrors.prioridad = "Campo obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        ...ticketAEditar,
        titulo: formData.titulo.trim().toUpperCase(),
        categoriaID: parseInt(formData.categoriaID),
        prioridad: parseInt(formData.prioridad),
        descripcion: formData.descripcion.trim().toUpperCase(),
      });

      notify(
        ticketAEditar
          ? "¡Ticket actualizado correctamente!"
          : "¡Ticket guardado correctamente!",
        formData.titulo.trim().toUpperCase(),
        "success",
      );
      onClose();
    } catch (err) {
      const errorData = err.response?.data;
      const serverMessage = errorData?.mensaje || "Error al procesar";
      setErrors({ server: serverMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] bg-white rounded-md border-none p-0 overflow-hidden shadow-2xl [&>button]:hidden">
        <DialogHeader className="p-3">
          <DialogTitle className="text-[#1e293b] flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <div className="bg-[#1e293b]/10 p-2 rounded-lg">
              {ticketAEditar ? (
                <Pencil size={22} />
              ) : (
                <Ticket size={22} />
              )}
            </div>
            {ticketAEditar ? "Editar Ticket" : "Nuevo Ticket"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="px-3 pb-3 space-y-3 bg-zinc-50/50 pt-2 border-t border-zinc-100"
        >
          <div className="space-y-1">
            <Label
              htmlFor="titulo"
              className={`text-[13px] font-semibold ml-1 ${errors.titulo ? "text-red-500" : "text-zinc-700"}`}
            >
              Título *
            </Label>
            <Input
              id="titulo"
              placeholder="Ej: FALLA EN LOGIN"
              value={formData.titulo}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`h-9 rounded-md bg-white border-zinc-200 focus-visible:ring-2 uppercase ${errors.titulo ? "border-red-400 focus-visible:ring-red-100" : "focus-visible:ring-zinc-200"}`}
            />
            {errors.titulo && (
              <p className="text-red-500 text-[11px] font-bold ml-1">
                {errors.titulo}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label
                htmlFor="categoriaID"
                className={`text-[13px] font-semibold ml-1 ${errors.categoriaID ? "text-red-500" : "text-zinc-700"}`}
              >
                Categoría *
              </Label>
              <Select
                disabled={isSubmitting}
                value={formData.categoriaID}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, categoriaID: value }));
                  if (errors.categoriaID)
                    setErrors((prev) => ({ ...prev, categoriaID: "" }));
                }}
              >
                <SelectTrigger
                  className={`h-9 bg-white border-zinc-200 ${errors.categoriaID ? "border-red-400 focus:ring-red-100" : "focus:ring-zinc-200"}`}
                >
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categorias.map((c) => (
                    <SelectItem key={c.categoriaID} value={c.categoriaID?.toString()}>
                      {c.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoriaID && (
                <p className="text-red-500 text-[11px] font-bold ml-1">
                  {errors.categoriaID}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="prioridad"
                className={`text-[13px] font-semibold ml-1 ${errors.prioridad ? "text-red-500" : "text-zinc-700"}`}
              >
                Prioridad *
              </Label>
              <Select
                disabled={isSubmitting}
                value={formData.prioridad}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, prioridad: value }));
                  if (errors.prioridad)
                    setErrors((prev) => ({ ...prev, prioridad: "" }));
                }}
              >
                <SelectTrigger
                  className={`h-9 bg-white border-zinc-200 ${errors.prioridad ? "border-red-400 focus:ring-red-100" : "focus:ring-zinc-200"}`}
                >
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="1">BAJA</SelectItem>
                  <SelectItem value="2">MEDIA</SelectItem>
                  <SelectItem value="3">ALTA</SelectItem>
                </SelectContent>
              </Select>
              {errors.prioridad && (
                <p className="text-red-500 text-[11px] font-bold ml-1">
                  {errors.prioridad}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="descripcion"
              className={"text-[13px] font-semibold ml-1 $text-zinc-700"}
            >
              Descripción 
            </Label>
            <Textarea
              id="descripcion"
              placeholder="DETALLE EL PROBLEMA"
              value={formData.descripcion}
              onChange={handleChange}
              disabled={isSubmitting}
              className={"w-full min-h-[100px] p-2 text-sm rounded-md bg-white border focus-visible:ring-2 outline-none transition-all resize-none shadow-sm uppercase border-zinc-200 focus-visible:ring-zinc-200"}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
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
              className="bg-[#1e293b] hover:bg-[#334155] text-white font-bold rounded-md px-4 h-9 shadow-lg active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : ticketAEditar ? (
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