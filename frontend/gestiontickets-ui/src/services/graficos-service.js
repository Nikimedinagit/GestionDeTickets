import api from '../api/axios';

export const graficosService = {
  getGraficoTortaCategoria: async (filtros) => {
    const payload = {
      categoriaID: filtros.CategoriaID || undefined,
      prioridad: filtros.Prioridad === 0 ? null : filtros.Prioridad,
      estado: filtros.Estado === 0 ? null : filtros.Estado,
      fechaInicio: filtros.FechaInicio || null,
      fechaFin: filtros.FechaFin || null,
    };

    const response = await api.post('/Resultados/GraficoTortaCategoria', payload);
    return response.data;
  },

  getGraficoBarraTicketsCerrados: async () => {
    const response = await api.post('/Resultados/GraficoBarraTicketsCerrados');
    return response.data;
  },

  getGraficoBarraTicketsCreadosCerrados: async () => {
    const response = await api.post('/resultados/graficobarraticketscreadoscerrados');
    return response.data;
  }
};
