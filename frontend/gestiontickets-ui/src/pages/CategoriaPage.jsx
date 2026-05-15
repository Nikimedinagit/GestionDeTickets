import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { AddButton } from "@/components/add-button";
import { CategoriasTable } from "@/components/tables/CategoriaTable";
import { categoriasService } from "@/services/categoria-service";
import { CategoriasFormModal } from "@/components/modals/CategoriaModal";
import { Trash2, RefreshCw, Layers, Loader2,AlertCircle } from "lucide-react";
import { notify } from "@/lib/notificaciones";

export default function CategoriaPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("activos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriasSeleccionado, setCategoriasSeleccionado] = useState(null);

  //** Función para obtener las categorias desde el servicio, con manejo de errores y estado de carga.
  const fetchCategorias = async (mostrarSpinner = false) => {
    try {
      if (mostrarSpinner) setLoading(true);
      const data = await categoriasService.getAll(filtroEstado, busqueda);
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  //** Función para manejar la creación o actualización de una categoria, dependiendo de si hay una categoria seleccionada.
  const handleSaveCategoria = async (categoria) => {
    if (categoriasSeleccionado) {
      await categoriasService.update(
        categoriasSeleccionado.categoriaID,
        categoria,
      );
    } else {
      await categoriasService.create(categoria);
    }
    fetchCategorias();
  };

  //** Función para abrir el modal de creación de una nueva categoria, asegurándose de limpiar cualquier selección previa.
  const handleNuevaCategoria = () => {
    setCategoriasSeleccionado(null);
    setIsModalOpen(true);
  };

  //** Función para abrir el modal de edición de una categoria existente, pasando la categoria seleccionada para su edición.
  const handleEditCategoria = (categoria) => {
    setCategoriasSeleccionado(categoria);
    setIsModalOpen(true);
  };

  //* Efecto para podr cambair de vista de activo a inactico y viceversa.
  useEffect(() => {
    setCategorias([]);
    fetchCategorias();
  }, [filtroEstado]);

  //* Efecto para el buscador, para pdoer filtrar datos.
  useEffect(() => {
    fetchCategorias(false);
  }, [busqueda]);

  //** Función para manejar la eliminación de una categoria, mostrando notificaciones de éxito o error según corresponda, y actualizando la lista de categorias después de la acción. */
  const handleDelete = async (categoria) => {
    try {
      await categoriasService.delete(categoria.categoriaID);
      notify(
        "¡Categoria eliminada correctamente!",
        `${categoria.descripcion} ha sido enviada a inactivos.`,
        "success",
        Trash2,
      );
      fetchCategorias();
    } catch (error) {
      const mensajeError =
        error.response?.data || "No se pudo eliminar el registro.";
      notify("Atención", mensajeError, "warning", AlertCircle);
    }
  };

  //** Función para manejar la restauración de una categoria, mostrando notificaciones de éxito o error según corresponda, y actualizando la lista de categoria después de la acción. */
  const handleRestore = async (categoria) => {
    try {
      await categoriasService.restore(categoria.categoriaID);
      notify(
        "¡Categoria restaurada correctamente!",
        `${categoria.descripcion} vuelve a estar activa.`,
        "success",
        RefreshCw,
      );
      fetchCategorias();
    } catch {
      notify("Error", "No se pudo restaurar la categoria.", "error");
    }
  };

  return (
    <div className="space-y-3 p-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionTitle
          title="Gestión de Categorias"
          subtitle="Define y organiza las categorías para la segmentación de incidentes."
          icon={Layers}
          className="mb-0"
        />

        <div className="shrink-0 mb-1">
          <AddButton label="Nueva Categoria" onClick={handleNuevaCategoria} />
        </div>
      </div>


        <CategoriasTable
          data={categorias}
          filter={filtroEstado}
          onFilterChange={setFiltroEstado}
          searchTerm={busqueda}
          onSearchChange={setBusqueda}
          onEdit={handleEditCategoria}
          onDelete={handleDelete}
          onRestore={handleRestore}
          isLoading={loading}
        />

      <CategoriasFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCategoriasSeleccionado(null);
        }}
        onSave={handleSaveCategoria}
        categoriaAEditar={categoriasSeleccionado}
      />
    </div>
  );
}
