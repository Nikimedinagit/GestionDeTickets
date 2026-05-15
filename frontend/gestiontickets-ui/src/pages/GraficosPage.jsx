import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { BarChart3, Loader2, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/SectionTitle";

import { Tooltip as CustomTooltip } from "@/components/ui/tooltip-custom";
import { graficosService } from "@/services/graficos-service";
import { categoriasService } from "@/services/categoria-service";
import { FiltroTickets } from "@/components/filtros/FiltrosTickets";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
);

export default function GraficosPage() {
  const [loading, setLoading] = useState(true);
  const [isFiltroOpen, setIsFiltroOpen] = useState(false);
  const [categoriasFiltro, setCategoriasFiltro] = useState([]);

  const [filtros, setFiltros] = useState({
    CategoriaID: null,
    Estado: null,
    Prioridad: null,
    FechaInicio: null,
    FechaFin: null,
  });

  const [dataTorta, setDataTorta] = useState(null);
  const [dataCerrados, setDataCerrados] = useState(null);
  const [dataComparativa, setDataComparativa] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await categoriasService.getAll("activos");
        setCategoriasFiltro(data);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setLoading(true);
        const [torta, cerrados, comparativa] = await Promise.all([
          graficosService.getGraficoTortaCategoria(filtros),
          graficosService.getGraficoBarraTicketsCerrados(filtros),
          graficosService.getGraficoBarraTicketsCreadosCerrados(filtros),
        ]);

        setDataTorta({
          labels: torta.map((item) => item.descripcion),
          datasets: [
            {
              data: torta.map((item) => item.cantidad),
              backgroundColor: [
                "#3b82f6",
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#8b5cf6",
              ],
            },
          ],
        });

        setDataCerrados({
          labels: cerrados.map((item) => item.mes),
          datasets: [
            {
              label: "Tickets Cerrados",
              data: cerrados.map((item) => item.cantidadCerrados),
              backgroundColor: "#10b981",
            },
          ],
        });

        setDataComparativa({
          labels: comparativa.map((item) => item.mes),
          datasets: [
            {
              label: "Creados",
              data: comparativa.map((item) => item.cantidadCreados),
              backgroundColor: "#3b82f6",
            },
            {
              label: "Cerrados",
              data: comparativa.map((item) => item.cantidadCerrados),
              backgroundColor: "#10b981",
            },
          ],
        });
      } catch (error) {
        console.error("Error cargando gráficos:", error);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchDatos();
  }, [filtros]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 11, weight: "600" }, usePointStyle: true },
      },
    },
  };

  return (
    <div className="space-y-4 p-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionTitle
          title="Estadísticas de Tickets"
          subtitle="Análisis detallado por categorías y estados mensuales."
          icon={BarChart3}
          className="mb-0"
        />

        <CustomTooltip text={isFiltroOpen ? "Ocultar" : "Filtros"}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFiltroOpen(!isFiltroOpen)}
            className={`h-9 w-9 border transition-all shadow-sm flex items-center justify-center rounded-md ${
              isFiltroOpen
                ? "bg-[#1e293b] text-white border-[#1e293b] hover:bg-[#1e293b]/90 hover:text-white"
                : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <ListFilter size={16} />
          </Button>
        </CustomTooltip>
      </div>

      <FiltroTickets
        isOpen={isFiltroOpen}
        onOpenChange={setIsFiltroOpen}
        filtros={filtros}
        setFiltros={setFiltros}
        categoriasFiltro={categoriasFiltro}
      />

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex justify-center items-center rounded-xl">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5">
            <ChartCard title="Tickets por Categorías">
              {dataTorta && <Pie data={dataTorta} options={options} />}
            </ChartCard>
          </div>

          <div className="md:col-span-7">
            <ChartCard title="Tickets Cerrados (Últimos Meses)">
              {dataCerrados && <Bar data={dataCerrados} options={options} />}
            </ChartCard>
          </div>

          <div className="md:col-span-12">
            <ChartCard title="Comparativo: Creados vs Cerrados">
              {dataComparativa && (
                <Bar data={dataComparativa} options={options} />
              )}
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm">
      <div className="bg-slate-50 px-4 py-2 text-center font-bold text-[10px] uppercase text-slate-500 border-b border-slate-200 tracking-widest">
        {title}
      </div>
      <div className="p-4 flex-grow" style={{ minHeight: "300px" }}>
        {children}
      </div>
    </div>
  );
}
