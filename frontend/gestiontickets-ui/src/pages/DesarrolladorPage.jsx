import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { AddButton } from "@/components/add-button";
import { DesarrolladorTable } from "@/components/tables/DesarrolladorTable";
import { desarrolladoresService } from "@/services/desarrollador-service";
import { puestosService } from "@/services/puesto-service";
import { DesarrolladoresFormModal } from "@/components/modals/DesarrolladorModal";
import { DesarrolladoresDetalleModal } from "@/components/modals/DetalleDesarrolladorModal";
import { Trash2, RefreshCw, Code2, Loader2, AlertCircle } from "lucide-react";
import { notify } from "@/lib/notificaciones";

export default function DesarrolladorPage() {
  const [desarrolladores, setDesarrolladores] = useState([]);
  const [puestos, setPuestos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("activos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [desarrolladoresSeleccionado, setDesarrolladoresSeleccionado] = useState(null);
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  const [desarrolladorSeleccionado, setDesarrolladorSeleccionado] = useState(null);

  const fetchPuestos = async () => {
    try {
      const data = await puestosService.getAll("activos"); 
      setPuestos(data);
    } catch (error) {
      console.error("Error al obtener puestos:", error);
    }
  };

  //** Función para obtener los desarroladores desde el servicio, con manejo de errores y estado de carga.
  const fetchDesarrollador = async (mostrarSpinner = false) => {
    try {
      if (mostrarSpinner) setLoading(true);
      const data = await desarrolladoresService.getAll(filtroEstado, busqueda);
      setDesarrolladores(data);
    } catch (error) {
      console.error("Error al obtener desarrolladores:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  //** Función para manejar la creación o actualización de un desarrolador, dependiendo de si hay un desarrolador seleccionada.
 const handleSaveDesarrollador = async (desarrolldor) => {
    try {
      if (desarrolladoresSeleccionado) {
        await desarrolladoresService.update(desarrolladoresSeleccionado.desarrolladorID, desarrolldor);
      } else {
        await desarrolladoresService.create(desarrolldor);
      }
      fetchDesarrollador();
    } catch (error) {
      console.error("Error al guardar:", error);
      throw error; 
    }
  };

  //** Función para abrir el modal de creación de un desarrollador, asegurándose de limpiar cualquier selección previa.
  const handleNuevoDesarrollador = () => {
    setDesarrolladoresSeleccionado(null);
    setIsModalOpen(true);
  };

  //** Función para abrir el modal de edición de un desarrollador existente, pasando el desarrollador seleccionada para su edición.
  const handleEditDesarrollador = (desarrollador) => {
    setDesarrolladoresSeleccionado(desarrollador);
    setIsModalOpen(true);
  };

  //* Efecto para podr cambair de vista de activo a inactico y viceversa.
  useEffect(() => {
    setDesarrolladores([]);
    fetchDesarrollador();
  }, [filtroEstado]);

  //* Efecto para el buscador, para pdoer filtrar datos.
  useEffect(() => {
    fetchDesarrollador(false);
  }, [busqueda]);

  useEffect(() => {
    fetchPuestos(); 
  }, [])

  //** Función para manejar la eliminación de un desarrollador, mostrando notificaciones de éxito o error según corresponda, y actualizando la lista de desarrollador después de la acción. */
  const handleDelete = async (desarrollador) => {
    try {
      await desarrolladoresService.delete(desarrollador.desarrolladorID);
      notify(
        "¡Desarrollador eliminado correctamente!",
        `${desarrollador.nombreCompleto} ha sido enviada a inactivos.`,
        "success",
        Trash2,
      );
      fetchDesarrollador();
    } catch (error) {
      const mensajeError =
        error.response?.data || "No se pudo eliminar el registro.";
      notify("Atención", mensajeError, "warning", AlertCircle);
    }
  };

  //** Función para manejar la restauración de un desarrollador, mostrando notificaciones de éxito o error según corresponda, y actualizando la lista de desarrollador después de la acción. */
  const handleRestore = async (desarrollador) => {
    try {
      await desarrolladoresService.restore(desarrollador.desarrolladorID);
      notify(
        "¡Desarrollador restaurado correctamente!",
        `${desarrollador.nombreCompleto} vuelve a estar activa.`,
        "success",
        RefreshCw,
      );
      fetchDesarrollador();
    } catch {
      console.error("Error", "No se pudo restaurar el desarrollador.", "error");
    }
  };

  const handleVerDetalle = (desarrollador) => {
    setDesarrolladorSeleccionado(desarrollador);
    setIsDetalleOpen(true);
  };

  return (
    <div className="space-y-3 p-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionTitle
          title="Gestión de Desarrolladores"
          subtitle="Administra el registro de desarrolladores y sus credenciales de acceso al sistema."
          icon={Code2}
          className="mb-0"
        />

        <div className="shrink-0 mb-1">
          <AddButton label="Nuevo Desarrollador" onClick={handleNuevoDesarrollador} />
        </div>
      </div>

      <DesarrolladorTable
        data={desarrolladores}
        filter={filtroEstado}
        onFilterChange={setFiltroEstado}
        searchTerm={busqueda}
        onSearchChange={setBusqueda}
        onEdit={handleEditDesarrollador}
        onDelete={handleDelete}
        onRestore={handleRestore}
        isLoading={loading}
        onDetalleDesarrollador={handleVerDetalle}
      />

      <DesarrolladoresFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDesarrolladoresSeleccionado(null);
        }}
        onSave={handleSaveDesarrollador}
        desarrolladorAEditar={desarrolladoresSeleccionado}
        puestos={puestos}
      />

      <DesarrolladoresDetalleModal
        isOpen={isDetalleOpen}
        onClose={() => setIsDetalleOpen(false)}
        desarrollador={desarrolladorSeleccionado}
      />
    </div>
  );
}
