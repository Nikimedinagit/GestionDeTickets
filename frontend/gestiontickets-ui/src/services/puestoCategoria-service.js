import api from '../api/axios';

export const puestoCategoriaService = {
  getByPuesto: async (puestoId) => {
    const response = await api.get(`/PuestosyCategorias/${puestoId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(`/PuestosyCategorias`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/PuestosyCategorias/${id}`);
  },
};