import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { BarChart3 } from "lucide-react";
import { ExportPdfButton } from "@/components/ExportPdfButton";
import { TicketsClienteCategoriaTable } from "@/components/tables/informes/TicketsClienteCategoriaTable";
import { estadisticaService } from "@/services/estadistica-service";
import { exportarTicketClienteCategoriaPDF } from "@/lib/export/ticketclientecategoria-pdf";

export default function TicketsClienteCategoriaPage() {
  const [estadisticas, setEstadisticas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEstadisticas = async () => {
    try {
      setLoading(true);
      const data = await estadisticaService.getEstadisticasPorCliente(); 
      setEstadisticas(data);
    } catch (error) {
      console.error("Error al obtener estadísticas de tickets:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }
  };

  useEffect(() => {
    fetchEstadisticas();
  }, []);

  const handleExport = () => {
    exportarTicketClienteCategoriaPDF(estadisticas);
  };

  return (
    <div className="space-y-3 p-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionTitle
          title="Estadísticas de Tickets por Cliente"
          subtitle="Métricas detalladas del estado de incidencias agrupadas por cliente y categorías."
          icon={BarChart3}
          className="mb-0"
        />

        <div className="shrink-0 mb-1">
          <ExportPdfButton
            onClick={handleExport}
            disabled={estadisticas.length === 0 || loading}
          />
        </div>
      </div>

      <TicketsClienteCategoriaTable data={estadisticas} isLoading={loading} />
    </div>
  );
}