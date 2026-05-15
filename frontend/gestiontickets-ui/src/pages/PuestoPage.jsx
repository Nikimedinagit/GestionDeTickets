import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { AddButton } from "@/components/add-button";
import { PuestosTable } from "@/components/tables/PuestoTable";
import { puestosService } from "@/services/puesto-service";
import { PuestosFormModal } from "@/components/modals/PuestoModal";
import { AsignarCategoriasModal } from "@/components/modals/AsignarCategoriasModal";
import { Trash2, RefreshCw, Network, Loader2, AlertCircle } from "lucide-react";
import { notify } from "@/lib/notificaciones";

export default function PuestoPage() {
  const [puestos, setPuestos] = useState([]);
  const [puestoCategorias, setPuestoCategorias] = useState(null);
  const [isCategoriasModalOpen, setIsCategoriasModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("activos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [puestosSeleccionado, setPuestosSeleccionado] = useState(null);

  //** Función para obtener las puestos desde el servicio, con manejo de errores y estado de carga.
  const fetchPuestos = async (mostrarSpinner = false) => {
    try {
      if (mostrarSpinner) setLoading(true);
      const data = await puestosService.getAll(filtroEstado, busqueda);
      setPuestos(data);
    } catch (error) {
      console.error("Error al obtener puestos:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  //** Función para manejar la creación o actualización de un puesto, dependiendo de si hay una puesto seleccionada.
  const handleSavePuesto = async (puestos) => {
    if (puestosSeleccionado) {
      await puestosService.update(puestosSeleccionado.puestoID, puestos);
    } else {
      await puestosService.create(puestos);
    }
    fetchPuestos();
  };

  //** Función para abrir el modal de creación de un nuevo puesto, asegurándose de limpiar cualquier selección previa.
  const handleNuevoPuesto = () => {
    setPuestosSeleccionado(null);
    setIsModalOpen(true);
  };

  //** Función para abrir el modal de edición de un puesto existente, pasando el puesto seleccionado para su edición.
  const handleEditPuesto = (puesto) => {
    setPuestosSeleccionado(puesto);
    setIsModalOpen(true);
  };

  //** Función para abrir el modal para agregar una categoria al puesto existente.
  const handleOpenCategorias = (puesto) => {
    setPuestoCategorias(puesto);
    setIsCategoriasModalOpen(true);
  };

  //* Efecto para podr cambair de vista de activo a inactico y viceversa.
  useEffect(() => {
    setPuestos([]);
    fetchPuestos();
  }, [filtroEstado]);

  //* Efecto para el buscador, para pdoer filtrar datos.
  useEffect(() => {
    fetchPuestos(false);
  }, [busqueda]);

  //** Función para manejar la eliminación de un puesto, mostrando notificaciones de éxito o error según corresponda, y actualizando la lista de puestos después de la acción. */
  const handleDelete = async (puesto) => {
    try {
      await puestosService.delete(puesto.puestoID);
      notify(
        "Puesto eliminado correctamente!",
        `${puesto.descripcion} ha sido enviada a inactivos.`,
        "success",
        Trash2,
      );
      fetchPuestos();
    } catch (error) {
      const mensajeError =
        error.response?.data || "No se pudo eliminar el registro.";
      notify("Atención", mensajeError, "warning", AlertCircle);
    }
  };

  //** Función para manejar la restauración de un puesto, mostrando notificaciones de éxito o error según corresponda, y actualizando la lista de puesto después de la acción. */
  const handleRestore = async (puesto) => {
    try {
      await puestosService.restore(puesto.puestoID);
      notify(
        "¡Categoria restaurado correctamente!",
        `${puesto.descripcion} vuelve a estar activa.`,
        "success",
        RefreshCw,
      );
      fetchPuestos();
    } catch {
      notify("Error", "No se pudo restaurar la puesto.", "error");
    }
  };

  return (
    <div className="space-y-3 p-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionTitle
          title="Gestión de Puestos"
          subtitle="Define y organiza los puestos para la estructura jerárquica y sus responsabilidades."
          icon={Network}
          className="mb-0"
        />

        <div className="shrink-0 mb-1">
          <AddButton label="Nuevo Puesto" onClick={handleNuevoPuesto} />
        </div>
      </div>

      <PuestosTable
        data={puestos}
        filter={filtroEstado}
        onFilterChange={setFiltroEstado}
        searchTerm={busqueda}
        onSearchChange={setBusqueda}
        onEdit={handleEditPuesto}
        onDelete={handleDelete}
        onRestore={handleRestore}
        isLoading={loading}
        onAsignarCategorias={handleOpenCategorias}
      />

      <PuestosFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPuestosSeleccionado(null);
        }}
        onSave={handleSavePuesto}
        puestoAEditar={puestosSeleccionado}
      />

      <AsignarCategoriasModal
        isOpen={isCategoriasModalOpen}
        onClose={() => setIsCategoriasModalOpen(false)}
        puesto={puestoCategorias}
      />
    </div>
  );
}
