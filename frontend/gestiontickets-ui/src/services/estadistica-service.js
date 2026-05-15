import api from '../api/axios';

export const estadisticaService = {

  getEstadisticasPorCliente: async () => {
    const response = await api.post('/resultados/EstadisticaTicketsPorClientesyCategorias');
    return response.data;
  },

  getEstadisticasPorDesarrollador: async (filtro = {}) => {
    const response = await api.post('/resultados/EstadisticaPorDesarrolladorCategoria', filtro);
    return response.data;
  },

};