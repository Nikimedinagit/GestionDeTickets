import api from '../api/axios';

export const tareasService = {

  getTareasPorEstados: async () => {
    const response = await api.post('/tickets/TareasPorEstados');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  }
};