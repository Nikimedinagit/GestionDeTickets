import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { BarChart3, ListFilter } from "lucide-react";
import { ExportPdfButton } from "@/components/ExportPdfButton";
import { Button } from "@/components/ui/button";
import { Tooltip as CustomTooltip } from "@/components/ui/tooltip-custom";

import { TicketsDesarrolladorCategoriaTable } from "@/components/tables/informes/TicketDesarrolladorCategoriaTable";
import { estadisticaService } from "@/services/estadistica-service";
import { exportarDesarrolladorCategoriaPDF } from "@/lib/export/ticketdesarrolladorcategoria-pdf";
import { FiltroFechasEstadistica } from "@/components/filtros/FiltroFechasEstadistica";

export default function TicketsDesarrolladorCategoriaPage() {
  const [estadisticas, setEstadisticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFiltroOpen, setIsFiltroOpen] = useState(false);

  const [filtros, setFiltros] = useState({
    FechaInicio: null,
    FechaFin: null,
  });

const [isInitialLoad, setIsInitialLoad] = useState(true);

const fetchEstadisticas = async () => {
  try {
    if (isInitialLoad) setLoading(true);
    
    const data = await estadisticaService.getEstadisticasPorDesarrollador(filtros); 
    setEstadisticas(data);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
  } finally {
    setLoading(false);
    setIsInitialLoad(false); 
  }
};
  useEffect(() => {
    fetchEstadisticas();
  }, [filtros]);

  const handleExport = () => {
    exportarDesarrolladorCategoriaPDF(estadisticas);
  };

  return (
    <div className="space-y-3 p-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionTitle
          title="Estadísticas de Tickets por Desarrollador"
          subtitle="Métricas de rendimiento en tickets cerrados por desarrollador y categoría."
          icon={BarChart3}
          className="mb-0"
        />

        <div className="flex items-center gap-2 shrink-0 mb-1">
          <CustomTooltip text={isFiltroOpen ? "Ocultar" : "Filtros"}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFiltroOpen(!isFiltroOpen)}
              className={`h-9 w-9 border transition-all shadow-sm ${
                isFiltroOpen
                  ? "bg-[#1e293b] text-white border-[#1e293b] hover:bg-[#1e293b]/90"
                  : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <ListFilter size={16} />
            </Button>
          </CustomTooltip>

          <ExportPdfButton
            onClick={handleExport}
            disabled={estadisticas.length === 0 || loading}
          />
        </div>
      </div>

      <FiltroFechasEstadistica 
        isOpen={isFiltroOpen} 
        onOpenChange={setIsFiltroOpen} 
        filtros={filtros} 
        setFiltros={setFiltros} 
      />

      <TicketsDesarrolladorCategoriaTable data={estadisticas} isLoading={loading} />
    </div>
  );
}