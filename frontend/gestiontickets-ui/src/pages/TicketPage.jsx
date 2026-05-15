import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { AddButton } from "@/components/add-button";
import { TicketTable } from "@/components/tables/TicketTable";
import { ticketsService } from "@/services/ticket-service";
import { categoriasService } from "@/services/categoria-service";
import { historialService } from "@/services/historial-service";
import { TicketsFormModal } from "@/components/modals/TicketModal";
import { TicketDetalleModal } from "@/components/modals/DetalleTicketModal";
import { HistorialTicketsModal } from "@/components/modals/HistorialTicketModal";
import { Ticket, Trash2, Play, CheckCircle } from "lucide-react";
import { notify } from "@/lib/notificaciones";
import { getUserRole } from "@/helpers/authHelper";

export default function TicketPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("activos");

  const [filtros, setFiltros] = useState({
    CategoriaID: null,
    Estado: null,
    Prioridad: null,
    FechaInicio: null,
    FechaFin: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  const [ticketDetalle, setTicketDetalle] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isHistorialOpen, setIsHistorialOpen] = useState(false);
  const [historialData, setHistorialData] = useState([]);
  const [ticketParaHistorial, setTicketParaHistorial] = useState(null);
  const [categoriasFiltro, setCategoriasFiltro] = useState([]); 
  const [categoriasModal, setCategoriasModal] = useState([]);

 const fetchCategorias = async () => {
  try {
    const activas = await categoriasService.getActivas();
    setCategoriasModal(activas);
   
    const todas = await categoriasService.getAll("activos"); 
    setCategoriasFiltro(todas);
    
  } catch (error) {
    console.error("Error al obtener categorías:", error);
  }
};

  const fetchTickets = async (mostrarSpinner = false) => {
    try {
      if (mostrarSpinner) setLoading(true);
      const data = await ticketsService.getAll(filtroEstado, busqueda, filtros);
      setTickets(data);
    } catch (error) {
      console.error("Error al obtener tickets:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }
  };

  useEffect(() => {
    fetchTickets(false);
  }, [filtroEstado, busqueda, filtros]);

  useEffect(() => {
    fetchCategorias();
    setUserRole(getUserRole());
  }, []);

  const handleSaveTicket = async (ticket) => {
    try {
      if (ticketSeleccionado) {
        await ticketsService.update(ticketSeleccionado.ticketID, ticket);
      } else {
        await ticketsService.create(ticket);
      }
      fetchTickets(true);
    } catch (error) {
      console.error("Error al guardar:", error);
      throw error;
    }
  };

  const handleNuevoTicket = () => {
    setTicketSeleccionado(null);
    setIsModalOpen(true);
  };

  const handleEditTicket = (ticket) => {
    setTicketSeleccionado(ticket);
    setIsModalOpen(true);
  };

  const handleDetalleTicket = (ticket) => {
    setTicketDetalle(ticket);
    setIsDetalleOpen(true);
  };

  const handleCancelarTicket = async (ticketId, ticketTitulo, comentario) => {
    try {
      await ticketsService.cancelar(ticketId, comentario);
      notify(
        "Ticket cancelado",
        `${ticketTitulo} finalizado.`,
        "success",
        Trash2,
      );
      setIsDetalleOpen(false);
      fetchTickets(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleIniciarTicket = async (ticketId, ticketTitulo) => {
    try {
      await ticketsService.iniciar(ticketId);
      notify("Ticket iniciado", `${ticketTitulo} en proceso.`, "success", Play);
      setIsDetalleOpen(false);
      fetchTickets(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCerrarTicket = async (ticketId, ticketTitulo, comentario) => {
    try {
      await ticketsService.cerrar(ticketId, comentario);
      notify(
        "Ticket cerrado",
        `${ticketTitulo} finalizado.`,
        "success",
        CheckCircle,
      );
      setIsDetalleOpen(false);
      fetchTickets(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerHistorial = async (ticket) => {
    try {
      setTicketParaHistorial(ticket);
      const data = await historialService.getByTicket(ticket.ticketID);
      setHistorialData(data);
      setIsHistorialOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-3 p-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionTitle
          title="Gestión de Tickets"
          subtitle="Administra las incidencias, consultas técnicas y requerimientos de los clientes."
          icon={Ticket}
          className="mb-0"
        />

        {userRole !== "DESARROLLADOR" && (
          <div className="shrink-0 mb-1">
            <AddButton label="Nuevo Ticket" onClick={handleNuevoTicket} />
          </div>
        )}
      </div>

      <TicketTable
        data={tickets}
        filter={filtroEstado}
        onFilterChange={setFiltroEstado}
        searchTerm={busqueda}
        onSearchChange={setBusqueda}
        onEdit={handleEditTicket}
        onDetalleTicket={handleDetalleTicket}
        onVerHistorial={handleVerHistorial}
        isLoading={loading}
        filtros={filtros}
        setFiltros={setFiltros}
        categoriasFiltro={categoriasFiltro}
      />

      <TicketsFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTicketSeleccionado(null);
        }}
        onSave={handleSaveTicket}
        ticketAEditar={ticketSeleccionado}
        categorias={categoriasModal}
      />

      <TicketDetalleModal
        isOpen={isDetalleOpen}
        onClose={() => {
          setIsDetalleOpen(false);
          setTicketDetalle(null);
        }}
        ticket={ticketDetalle}
        rolUsuario={userRole}
        onCancelar={handleCancelarTicket}
        onIniciar={handleIniciarTicket}
        onCerrar={handleCerrarTicket}
      />

      <HistorialTicketsModal
        isOpen={isHistorialOpen}
        onClose={() => {
          setIsHistorialOpen(false);
          setHistorialData([]);
        }}
        ticket={ticketParaHistorial}
        historial={historialData}
      />
    </div>
  );
}
