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
import { Loader2, Code2, Pencil } from "lucide-react";
import { notify } from "@/lib/notificaciones";

export function DesarrolladoresFormModal({
  isOpen,
  onClose,
  onSave,
  puestos = [],
  desarrolladorAEditar = null,
}) {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    dni: "",
    email: "",
    telefono: "",
    observacion: "",
    puestoID: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (desarrolladorAEditar && isOpen) {
      setFormData({
        nombreCompleto: desarrolladorAEditar.nombreCompleto || "",
        dni: desarrolladorAEditar.dni || "",
        email: desarrolladorAEditar.email || "",
        telefono: desarrolladorAEditar.telefono || "",
        observacion: desarrolladorAEditar.observacion || "",
        puestoID: desarrolladorAEditar.puestoID.toString() || "",
      });
    } else if (!isOpen) {
      setFormData({
        nombreCompleto: "",
        dni: "",
        email: "",
        telefono: "",
        observacion: "",
        puestoID: "",
      });
      setErrors({});
    }
  }, [desarrolladorAEditar, isOpen]);

  const handleClose = () => {
    onClose();
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombreCompleto.trim())
      newErrors.nombreCompleto = "Campo obligatorio";
    else if (formData.nombreCompleto.trim().length < 3)
      newErrors.nombreCompleto = "Mínimo 3 caracteres";

    const dniRegex = /^\d{8}$/;
    if (!formData.dni.toString().trim()) newErrors.dni = "Campo obligatorio";
    else if (!dniRegex.test(formData.dni))
      newErrors.dni = "Debe tener 8 dígitos";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "Campo obligatorio";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Email inválido (ej@algo.com)";

    if (!formData.puestoID) newErrors.puestoID = "Campo obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        ...desarrolladorAEditar,
        nombreCompleto: formData.nombreCompleto.trim().toUpperCase(),
        dni: parseInt(formData.dni),
        email: formData.email.trim().toLowerCase(),
        telefono: formData.telefono.trim(),
        observacion: formData.observacion.trim().toUpperCase(),
        puestoID: parseInt(formData.puestoID),
        estado: desarrolladorAEditar ? desarrolladorAEditar.estado : true,
      });

      notify(
        desarrolladorAEditar
          ? "¡Desarrollador actualizado correctamente!"
          : "¡Desarrollador guardado correctamente!",
        formData.nombreCompleto.trim().toUpperCase(),
        "success",
      );
      onClose();
    } catch (err) {
      const errorData = err.response?.data;
      const serverMessage = errorData?.mensaje || "Error al procesar";

      if (errorData?.campo === "DNI") {
        setErrors({ dni: "Ya se encuentra registrado" });
      } else if (errorData?.campo === "EMAIL") {
        setErrors({ email: "Ya se encuentra registrado" });
      } else {
        setErrors({ server: serverMessage });
      }
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
              {desarrolladorAEditar ? (
                <Pencil size={22} />
              ) : (
                <Code2 size={22} />
              )}
            </div>
            {desarrolladorAEditar
              ? "Editar Desarrollador"
              : "Nuevo Desarrollador"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="px-3 pb-3 space-y-3 bg-zinc-50/50 pt-2 border-t border-zinc-100"
        >
          <div className="space-y-1">
            <Label
              htmlFor="nombreCompleto"
              className={`text-[13px] font-semibold ml-1 ${errors.nombreCompleto ? "text-red-500" : "text-zinc-700"}`}
            >
              Nombre Completo *
            </Label>
            <Input
              id="nombreCompleto"
              placeholder="Ej: JUAN PEREZ"
              value={formData.nombreCompleto}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`h-9 rounded-md bg-white border-zinc-200 focus-visible:ring-2 uppercase ${errors.nombreCompleto ? "border-red-400 focus-visible:ring-red-100" : "focus-visible:ring-zinc-200"}`}
            />
            {errors.nombreCompleto && (
              <p className="text-red-500 text-[11px] font-bold ml-1">
                {errors.nombreCompleto}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label
                htmlFor="dni"
                className={`text-[13px] font-semibold ml-1 ${errors.dni ? "text-red-500" : "text-zinc-700"}`}
              >
                DNI *
              </Label>
              <Input
                id="dni"
                type="number"
                placeholder="Ej: 12345678"
                value={formData.dni}
                onChange={handleChange}
                disabled={isSubmitting || !!desarrolladorAEditar}
                className={`h-9 rounded-md bg-white border-zinc-200 focus-visible:ring-2 uppercase ${errors.dni ? "border-red-400 focus-visible:ring-red-100" : "focus-visible:ring-zinc-200"}`}
              />
              {errors.dni && (
                <p className="text-red-500 text-[11px] font-bold ml-1">
                  {errors.dni}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="telefono"
                className="text-[13px] font-semibold ml-1 text-zinc-700"
              >
                Teléfono
              </Label>
              <Input
                id="telefono"
                placeholder="Ej: 3551 123522"
                value={formData.telefono}
                onChange={handleChange}
                disabled={isSubmitting}
                className={
                  "h-9 rounded-md bg-white border-zinc-200 focus-visible:ring-2 uppercase focus-visible:ring-zinc-200"
                }
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="email"
              className={`text-[13px] font-semibold ml-1 ${errors.email ? "text-red-500" : "text-zinc-700"}`}
            >
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="EJ: juan@gmail.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting || !!desarrolladorAEditar}
              className={`h-9 rounded-md bg-white border-zinc-200 focus-visible:ring-2 ${errors.email ? "border-red-400 focus-visible:ring-red-100" : "focus-visible:ring-zinc-200"}`}
            />
            {errors.email && (
              <p className="text-red-500 text-[11px] font-bold ml-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="puestoID"
              className={`text-[13px] font-semibold ml-1 ${errors.puestoID ? "text-red-500" : "text-zinc-700"}`}
            >
              Puesto *
            </Label>
            <Select
              disabled={isSubmitting}
              value={formData.puestoID}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, puestoID: value }));
                if (errors.puestoID)
                  setErrors((prev) => ({ ...prev, puestoID: "" }));
              }}
            >
              <SelectTrigger
                className={`h-9 bg-white border-zinc-200 ${errors.puestoID ? "border-red-400 focus:ring-red-100" : "focus:ring-zinc-200"}`}
              >
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {puestos.map((p) => (
                  <SelectItem key={p.puestoID} value={p.puestoID.toString()}>
                    {p.descripcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.puestoID && (
              <p className="text-red-500 text-[11px] font-bold ml-1">
                {errors.puestoID}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="observacion"
              className="text-[13px] font-semibold ml-1 text-zinc-700"
            >
              Observación
            </Label>
            <Textarea
              id="observacion"
              placeholder="DETALLES ADICIONALES"
              value={formData.observacion}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full min-h-[80px] p-2 text-sm rounded-md bg-white border border-zinc-200 focus:ring-zinc-200 focus-visible:ring-2 outline-none transition-all resize-none shadow-sm uppercase"
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
              ) : desarrolladorAEditar ? (
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
