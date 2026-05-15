import api from '../api/axios';

export const historialService = {
  getByTicket: async (ticketId) => {
    const response = await api.get(`/HistorialTickets?ticketId=${ticketId}`);
    return response.data;
  }
};