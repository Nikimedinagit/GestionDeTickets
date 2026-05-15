import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import DashboardLayout from "@/pages/Layout";
import LoginPage from "@/pages/LoginPage";
import PanelPrincipal from "@/pages/PanelPrincipalPage";
import CategoriaPage from "@/pages/CategoriaPage";
import PuestoPage from "@/pages/PuestoPage";
import ClientePage from "@/pages/ClientePage";
import DesarrolladorPage from "@/pages/DesarrolladorPage";
import TicketPage from "@/pages/TicketPage";
import TareaPage from "@/pages/TareaPage";
import GraficosPage from "@/pages/GraficosPage";
import TicketsClienteCategoriaPage from "./pages/TicketClienteCategoria";
import TicketsDesarrolladorCategoriaPage from "./pages/TicketDesarrolladorCategoria";

import { ProtectedRoute } from "@/components/ProtectedRoute"; 

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors closeButton />

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}> 
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<PanelPrincipal />} />
            <Route path="categorias/categoria" element={<CategoriaPage />} />
            <Route path="puestos/puesto" element={<PuestoPage />} />
            <Route path="clientes/cliente" element={<ClientePage />} />
            <Route path="desarrolladores/desarrollador" element={<DesarrolladorPage />} />
            <Route path="tickets/ticket" element={<TicketPage />} />
            <Route path="tickets/tarea" element={<TareaPage />} />
            <Route path="resultados/grafico" element={<GraficosPage />} />
            <Route path="resultados/cliente-estadistico" element={<TicketsClienteCategoriaPage />} />
            <Route path="resultados/desarrollador-estadistico" element={<TicketsDesarrolladorCategoriaPage />} />

          </Route>
        </Route>

        <Route
          path="*"
          element={<div className="p-10">404 - Página no encontrada</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;