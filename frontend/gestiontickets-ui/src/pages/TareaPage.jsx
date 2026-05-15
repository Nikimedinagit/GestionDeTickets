import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { tareasService } from "@/services/tareas-service";
import { TicketDetalleModal } from "@/components/modals/DetalleTicketModal";
import {
  Network,
  Layout,
  Calendar,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { getUserRole } from "@/helpers/authHelper";

export default function TareasPage() {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  const [ticketDetalle, setTicketDetalle] = useState(null);

  const fetchTareas = async () => {
    try {
      setLoading(true);
      const data = await tareasService.getTareasPorEstados();
      setTareas(data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareas();
    setUserRole(getUserRole());
  }, []);

  const handleOpenDetalle = (tarea) => {
    setTicketDetalle(tarea);
    setIsDetalleOpen(true);
  };

  const ColumnaTareas = ({ titulo, estadoId, colorClass, icon: Icon }) => {
    const tareasFiltradas = tareas.filter((t) => t.estado === estadoId);

    return (
      <div className="flex flex-col h-fit bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
        <div
          className={`p-1 rounded-t-lg border-b-2 ${colorClass} flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wider`}
        >
          <Icon size={18} />
          {titulo} ({tareasFiltradas.length})
        </div>

        <div className="p-2 space-y-3 bg-white overflow-y-auto max-h-[460px] h-auto scrollbar-thin scrollbar-thumb-slate-200">
          {tareasFiltradas.map((tarea) => (
            <TareaCard
              key={tarea.ticketID}
              tarea={tarea}
              onClick={() => handleOpenDetalle(tarea)}
            />
          ))}

          {tareasFiltradas.length === 0 && !loading && (
            <p className="px-4 py-2 text-center text-zinc-400 font-medium">
              No hay tareas
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 p-0">
      <SectionTitle
        title="Gestión de Tareas"
        subtitle="Visualiza y organiza el flujo de trabajo según el estado de los tickets."
        icon={Layout}
        className="mb-0"
      />

      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        {/* <div className="flex justify-start mb-4">
           <button 
             className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors"
             onClick={() => console.log("Generar Informe")}
           >
             <Network size={16} />
             Generar Informe
           </button>
        </div> */}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ColumnaTareas
              titulo="Abiertos"
              estadoId={1}
              colorClass="bg-blue-50 text-blue-700 border-blue-200"
              icon={Calendar}
            />
            <ColumnaTareas
              titulo="En Proceso"
              estadoId={2}
              colorClass="bg-orange-50 text-orange-700 border-orange-200"
              icon={Clock}
            />
            <ColumnaTareas
              titulo="Cerrados"
              estadoId={3}
              colorClass="bg-green-50 text-green-700 border-green-200"
              icon={CheckCircle}
            />
          </div>
        )}
      </div>

      <TicketDetalleModal
        isOpen={isDetalleOpen}
        onClose={() => {
          setIsDetalleOpen(false);
          setTicketDetalle(null);
        }}
        ticket={ticketDetalle}
        rolUsuario={userRole}
        onCancelar={() => fetchTareas()}
        onIniciar={() => fetchTareas()}
        onCerrar={() => fetchTareas()}
      />
    </div>
  );
}

function TareaCard({ tarea, onClick }) {
  const getFechaAMostrar = () => {
    if (tarea.estado === 3)
      return { label: "Cerrado:", fecha: tarea.fechaDeCierre };
    if (tarea.estado === 2)
      return { label: "Iniciado:", fecha: tarea.fechaDeComienzo };
    return { label: "Creado:", fecha: tarea.fechaDeCreacion };
  };

  const infoFecha = getFechaAMostrar();

  return (
    <div
      onClick={onClick}
      className="bg-white p-3 rounded-md shadow-sm border border-slate-200 hover:border-primary cursor-pointer transition-all hover:shadow-md group"
    >
      <h4 className="font-semibold text-slate-800 text-sm group-hover:text-primary transition-colors line-clamp-2">
        {tarea.titulo}
      </h4>
      <div className="mt-2 flex items-center gap-1 text-[13px] text-slate-500">
        <Calendar size={14} />
        <span className="font-medium">{infoFecha.label}</span>
        <span>
          {infoFecha.fecha
            ? new Date(infoFecha.fecha).toLocaleDateString()
            : "---"}
        </span>
      </div>
    </div>
  );
}
