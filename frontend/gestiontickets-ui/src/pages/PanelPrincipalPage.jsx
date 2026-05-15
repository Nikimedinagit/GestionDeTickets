import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  Clock,
  Ticket,
  Info,
  UserPlus,
  Code2,
  ArrowRight,
  LayoutDashboard,
  Briefcase,
  Layers,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/SectionTitle";
import { getUserRole } from "@/helpers/authHelper";
import { panelService } from "@/services/panel-service"; 

export default function PanelPrincipal() {
  const navigate = useNavigate();
  const userRole = getUserRole();

  const [stats, setStats] = useState(null);
  const [ultimosTickets, setUltimosTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [sData, tData] = await Promise.all([
          panelService.getEstadisticas(),
          panelService.getUltimosTickets()
        ]);
        setStats(sData);
        setUltimosTickets(tData);
      } catch (error) {
        console.error("Error al cargar panel:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-700">
      <SectionTitle
        title="Panel Principal"
        subtitle="Vista global del soporte con métricas clave y actividad en tiempo real."
        icon={LayoutDashboard}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <StatCard
            title="Total Tickets"
            icon={<Ticket className="size-4 text-white" />}
            iconBg="bg-[#1e293b]"
            accentColor="border-l-blue-600"
            items={[
              {
                label: "Hoy",
                value: stats?.total.hoy || 0,
                color: "text-blue-600",
              },
              {
                label: "Semana",
                value: stats?.total.semana || 0,
                color: "text-blue-600",
              },
              {
                label: "Total",
                value: stats?.total.sistema || 0,
                color: "text-[#1e293b]",
              },
            ]}
          />
        </div>
        <div>
          <StatCard
            title="Estados"
            icon={<Info className="size-4 text-white" />}
            iconBg="bg-[#1e293b]"
            accentColor="border-l-purple-600"
            items={[
              {
                label: "Abiertos",
                value: stats?.estados.abiertos || 0,
                color: "text-blue-600",
              },
              {
                label: "En Proceso",
                value: stats?.estados.proceso || 0,
                color: "text-orange-600",
              },
              {
                label: "Cerrados",
                value: stats?.estados.cerrados || 0,
                color: "text-green-600",
              },
            ]}
          />
        </div>
        <div>
          <StatCard
            title="Prioridades"
            icon={<Zap className="size-4 text-white" />}
            iconBg="bg-[#1e293b]"
            accentColor="border-l-red-600"
            items={[
              {
                label: "Alta",
                value: stats?.prioridades.alta || 0,
                color: "text-red-600",
              },
              {
                label: "Media",
                value: stats?.prioridades.media || 0,
                color: "text-orange-600",
              },
              {
                label: "Baja",
                value: stats?.prioridades.baja || 0,
                color: "text-yellow-400",
              },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 bg-white border-none shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 py-1">
            <div className="flex items-center gap-2 text-[#1e293b]">
              <div className="p-1.5 bg-[#1e293b] rounded-md flex items-center justify-center">
                <Clock className="size-4 text-white" />
              </div>
              <CardTitle className="text-[13px] font-bold">
                Últimos Movimientos
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-100 tracking-tight">
                <TableRow className="border-none">
                  <TableHead className="font-bold text-[13px] text-[#1e293b] px-4">
                    CLIENTE
                  </TableHead>
                  <TableHead className="font-bold text-[13px] text-[#1e293b]">
                    ASUNTO
                  </TableHead>
                  <TableHead className="text-center font-bold text-[13px] text-[#1e293b]">
                    ESTADO
                  </TableHead>
                  <TableHead className="text-right font-bold text-[13px] text-[#1e293b] px-4">
                    FECHA
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimosTickets.map((ticket) => (
                  <TableRow
                    key={ticket.ticketID}
                    className="group hover:bg-slate-50/50 transition-colors border-slate-100"
                  >
                    <TableCell className="font-bold text-[#1e293b] text-sm px-4">
                      {ticket.cliente}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm font-bold">
                      {ticket.titulo}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={`text-[10px] font-bold border-none px-2 py-0.5 uppercase ${
                          ticket.estado === 1
                            ? "bg-blue-100 text-blue-700"
                            : ticket.estado === 2
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {ticket.estado === 1
                          ? "Abierto"
                          : ticket.estado === 2
                            ? "En Proceso"
                            : "Cerrado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-slate-400 text-xs font-bold px-4">
                      {new Date(ticket.fechaDeCreacion).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="p-2 bg-slate-50/20 flex justify-end border-t border-slate-50">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 font-bold text-sm hover:bg-blue-50"
              onClick={() => navigate("/tickets/ticket")}
            >
              Ver historial <ArrowRight className="ml-2 size-4" />
            </Button>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-2 -ml-2">
          {userRole !== "DESARROLLADOR" && (
            <>
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Zap className="size-3" />
                <h6 className="font-bold uppercase tracking-tight text-xs">
                  Acciones Rápidas
                </h6>
              </div>

              <QuickActionBtn
                icon={<Ticket />}
                label="Crear Nuevo Ticket"
                color="bg-[#1e293b]"
                onClick={() => navigate("/tickets/ticket")}
              />

              {userRole === "ADMINISTRADOR" && (
                <>
                  <QuickActionBtn
                    icon={<UserPlus />}
                    label="Registrar Cliente"
                    color="bg-[#1e293b]"
                    onClick={() => navigate("/clientes/cliente")}
                  />
                  <QuickActionBtn
                    icon={<Code2 />}
                    label="Asignar Desarrollador"
                    color="bg-[#1e293b]"
                    onClick={() => navigate("/desarrolladores/desarrollador")}
                  />
                  <QuickActionBtn
                    icon={<Briefcase />}
                    label="Agregar Puesto"
                    color="bg-[#1e293b]"
                    onClick={() => navigate("/puestos/puesto")}
                  />
                  <QuickActionBtn
                    icon={<Layers />}
                    label="Agregar Categoría"
                    color="bg-[#1e293b]"
                    onClick={() => navigate("/categorias/categoria")}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, icon, items, accentColor, iconBg }) {
  return (
    <Card
      className={`bg-white shadow-sm border-none border-l-4 ${accentColor} transition-all hover:shadow-md`}
    >
      <CardHeader className="p-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-[16px] font-bold text-[#1e293b] tracking-tight">
          {title}
        </CardTitle>
        <div
          className={`p-2 ${iconBg} rounded-lg shadow-sm flex items-center justify-center`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-col gap-2.5">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-slate-50 pb-1"
            >
              <span className="text-sm font-bold text-slate-500 tracking-tight">
                {item.label}
              </span>
              <span className={`text-sm font-bold tabular-nums ${item.color}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionBtn({ icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-2 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:translate-x-1 transition-all group text-left"
    >
      <div
        className={`p-2 rounded-lg ${color} text-white group-hover:scale-110 transition-transform shadow-sm flex items-center justify-center`}
      >
        {React.cloneElement(icon, { size: 16 })}
      </div>
      <span className="text-sm font-bold text-[#1e293b] tracking-tight">
        {label}
      </span>
    </button>
  );
}
