import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { AddButton } from "@/components/add-button";
import { Trash2, Network } from "lucide-react";
import { puestoCategoriaService } from "@/services/puestoCategoria-service";
import { categoriasService } from "@/services/categoria-service";
import { notify } from "@/lib/notificaciones";

export function AsignarCategoriasModal({ isOpen, onClose, puesto }) {
  const [categoriasAsignadas, setCategoriasAsignadas] = useState([]);
  const [todasLasCategorias, setTodasLasCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (puesto && isOpen) {
      cargarCategoriasDelPuesto();
      cargarTodasLasCategorias();
    }
  }, [puesto, isOpen]);

  const cargarCategoriasDelPuesto = async () => {
    try {
      const data = await puestoCategoriaService.getByPuesto(puesto.puestoID);
      setCategoriasAsignadas(data);
    } catch (err) {
      console.error("Error al cargar categorías del puesto", err);
    }
  };

  const cargarTodasLasCategorias = async () => {
    try {
      const data = await categoriasService.getAll("activos", "");
      setTodasLasCategorias(data);
    } catch (err) {
      console.error("Error al cargar catálogo de categorías", err);
    }
  };

  const handleAsignar = async () => {
    if (!categoriaSeleccionada) {
      setError("Campo obligatorio");
      return;
    }

    try {
      setLoading(true);
      const nuevaRelacion = {
        puestoID: puesto.puestoID,
        categoriaID: parseInt(categoriaSeleccionada),
      };

      await puestoCategoriaService.create(nuevaRelacion);
      const categoria = todasLasCategorias.find(
        (c) => c.categoriaID === parseInt(categoriaSeleccionada)
      );

      setCategoriaSeleccionada("");
      setError("");
      await cargarCategoriasDelPuesto();

      notify(
        "Categoría asignada correctamente",
        `"${categoria?.descripcion}" se vinculo con éxito.`,
        "success",
        Network
      );
    } catch (err) {
      const msj = err.response?.data?.mensaje || "Error al asignar";
      setError(msj);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarRelacion = async (id) => {
    try {
      const relacion = categoriasAsignadas.find(
        (r) => r.puestoCategoriaID === id
      );
      const descripcion = relacion?.categoria?.descripcion || relacion?.Categoria?.Descripcion || "";

      await puestoCategoriaService.delete(id);
      await cargarCategoriasDelPuesto();

      notify(
        "¡Categoría eliminada correctamente!",
        `${descripcion} ya no pertenece a este puesto.`,
        "success"
      );
    } catch {
      console.error("Error al eliminar la relación");
    }
  };

  const handleClose = () => {
    setCategoriaSeleccionada("");
    setCategoriasAsignadas([]);
    setError("");
    onClose();
  };

  const categoriasDisponibles = todasLasCategorias.filter(
    (cat) => !categoriasAsignadas.some((rel) => rel.categoriaID === cat.categoriaID)
  );

  if (!puesto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="w-[95%] sm:max-w-[750px] 
               bg-white rounded-md border-none p-0 shadow-2xl 
               h-auto max-h-[90vh] flex flex-col 
               overflow-hidden
               [&>button]:hidden"
      >
        <DialogHeader className="p-3 shrink-0">
          <DialogTitle className="text-[#1e293b] flex items-center gap-3 text-lg sm:text-xl font-extrabold tracking-tight">
            <div className="bg-[#1e293b]/10 p-2 rounded-lg shrink-0">
              <Network size={22} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span>Asignar Categorías</span>
              <span className="text-[#334155] font-bold text-sm sm:text-base truncate max-w-[200px] sm:max-w-full">
                "{puesto.nombre || puesto.descripcion}"
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="px-3 pb-3 pt-3 space-y-4 border-t border-zinc-100 bg-zinc-50/50 flex-1 flex flex-col overflow-hidden">
          
          <div className="space-y-1.5 shrink-0">
            <Label className={`text-[14px] font-semibold ml-1 ${error ? "text-red-500" : "text-zinc-700"}`}>
              Categoría *
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={categoriaSeleccionada}
                onValueChange={(value) => {
                  setCategoriaSeleccionada(value);
                  if (error) setError("");
                }}
              >
                <SelectTrigger className={`w-full sm:flex-1 !h-9 bg-white shadow-sm transition-all ${error ? "border-red-400" : "border-zinc-200"}`}>
                  <SelectValue placeholder={categoriasDisponibles.length === 0 ? "No hay disponibles" : "Seleccione..."} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categoriasDisponibles.map((c) => (
                    <SelectItem key={c.categoriaID} value={c.categoriaID.toString()} className="cursor-pointer uppercase text-xs font-semibold">
                      {c.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <AddButton
                label={loading ? "Asignando..." : "Asignar"}
                className="tracking-[0.08em] !h-9 w-full sm:w-auto"
                onClick={handleAsignar}
                disabled={loading || categoriasDisponibles.length === 0}
              />
            </div>
            {error && <p className="text-red-500 text-[12px] font-bold ml-1 mt-1">{error}</p>}
          </div>

          <div className="bg-white rounded-md shadow-xl border border-zinc-100 flex flex-col overflow-hidden">
            <div className="overflow-y-auto max-h-[250px] sm:max-h-[300px]">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr className="h-8 bg-[#1e293b]/[0.06] text-[#1e293b] uppercase tracking-[0.08em] font-bold border-b border-[#1e293b]/10">
                    <th className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-0.5 h-3 bg-[#1e293b] rounded-full" />
                        Categoría Asignada
                      </div>
                    </th>
                    <th className="px-2 py-1 text-center w-16">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {categoriasAsignadas.length > 0 ? (
                    categoriasAsignadas.map((rel) => (
                      <tr key={rel.puestoCategoriaID} className="h-8 group hover:bg-[#1e293b]/[0.06] transition-colors">
                        <td className="px-4 py-1">
                          <span className="font-semibold text-zinc-700 uppercase text-[11px] sm:text-xs">
                            {rel.categoria?.descripcion || rel.Categoria?.Descripcion}
                          </span>
                        </td>
                        <td className="px-2 py-1 text-center">
                          <button
                            onClick={() => handleEliminarRelacion(rel.puestoCategoriaID)}
                            className="p-1.5 text-rose-500 rounded-md hover:bg-rose-50 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="px-4 py-2 text-center text-zinc-400 font-medium">
                        No hay categorías vinculadas.
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
              onClick={handleClose}
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