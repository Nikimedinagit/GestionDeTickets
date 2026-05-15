import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { AddButton } from "@/components/add-button";
import { ClientesTable } from "@/components/tables/ClienteTable";
import { clientesService } from "@/services/cliente-service";
import { ClientesFormModal } from "@/components/modals/ClienteModal";
import { ClientesDetalleModal } from "@/components/modals/DetalleClienteModal";
import { Trash2, RefreshCw, Users, Loader2, AlertCircle } from "lucide-react";
import { notify } from "@/lib/notificaciones";

export default function CategoriaPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("activos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientesSeleccionado, setClientesSeleccionado] = useState(null);
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  //** Función para obtener los clientes desde el servicio, con manejo de errores y estado de carga.
  const fetchClientes = async (mostrarSpinner = false) => {
    try {
      if (mostrarSpinner) setLoading(true);
      const data = await clientesService.getAll(filtroEstado, busqueda);
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  //** Función para manejar la creación o actualización de un cliente, dependiendo de si hay un cliente seleccionada.
  const handleSaveCliente = async (cliente) => {
    if (clientesSeleccionado) {
      await clientesService.update(clientesSeleccionado.clienteID, cliente);
    } else {
      await clientesService.create(cliente);
    }
    fetchClientes();
  };

  //** Función para abrir el modal de creación de un cliente, asegurándose de limpiar cualquier selección previa.
  const handleNuevoCliente = () => {
    setClientesSeleccionado(null);
    setIsModalOpen(true);
  };

  //** Función para abrir el modal de edición de un cliente existente, pasando el cliente seleccionada para su edición.
  const handleEditCliente = (cliente) => {
    setClientesSeleccionado(cliente);
    setIsModalOpen(true);
  };

  //* Efecto para podr cambair de vista de activo a inactico y viceversa.
  useEffect(() => {
    setClientes([]);
    fetchClientes();
  }, [filtroEstado]);

  //* Efecto para el buscador, para pdoer filtrar datos.
  useEffect(() => {
    fetchClientes(false);
  }, [busqueda]);

  //** Función para manejar la eliminación de un cliente, mostrando notificaciones de éxito o error según corresponda, y actualizando la lista de cleinte después de la acción. */
  const handleDelete = async (cliente) => {
    try {
      await clientesService.delete(cliente.clienteID);
      notify(
        "Cliente eliminado correctamente!",
        `${cliente.nombreCompleto} ha sido enviada a inactivos.`,
        "success",
        Trash2,
      );
      fetchClientes();
    } catch (error) {
      const mensajeError =
        error.response?.data || "No se pudo eliminar el registro.";
      notify("Atención", mensajeError, "warning", AlertCircle);
    }
  };

  //** Función para manejar la restauración de un cliente, mostrando notificaciones de éxito o error según corresponda, y actualizando la lista de cliente después de la acción. */
  const handleRestore = async (cliente) => {
    try {
      await clientesService.restore(cliente.clienteID);
      notify(
        "Cliente restaurado correctamente!",
        `${cliente.nombreCompleto} vuelve a estar activa.`,
        "success",
        RefreshCw,
      );
      fetchClientes();
    } catch {
      console.error("Error", "No se pudo restaurar el cliente.", "error");
    }
  };

  const handleVerDetalle = (cliente) => {
    setClienteSeleccionado(cliente);
    setIsDetalleOpen(true);
  };

  return (
    <div className="space-y-3 p-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionTitle
          title="Gestión de Clientes"
          subtitle="Administra el registro de clientes y sus credenciales de acceso al sistema."
          icon={Users}
          className="mb-0"
        />

        <div className="shrink-0 mb-1">
          <AddButton label="Nuevo Cliente" onClick={handleNuevoCliente} />
        </div>
      </div>

      <ClientesTable
        data={clientes}
        filter={filtroEstado}
        onFilterChange={setFiltroEstado}
        searchTerm={busqueda}
        onSearchChange={setBusqueda}
        onEdit={handleEditCliente}
        onDelete={handleDelete}
        onRestore={handleRestore}
        isLoading={loading}
        onDetalleCliente={handleVerDetalle}
      />

      <ClientesFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setClientesSeleccionado(null);
        }}
        onSave={handleSaveCliente}
        clienteAEditar={clientesSeleccionado}
      />

      <ClientesDetalleModal
        isOpen={isDetalleOpen}
        onClose={() => setIsDetalleOpen(false)}
        cliente={clienteSeleccionado}
      />
    </div>
  );
}
