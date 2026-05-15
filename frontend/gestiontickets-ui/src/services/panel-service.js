import api from '../api/axios';

export const panelService = {
    getEstadisticas: async () => {
        try {
            const response = await api.get("/panelprincipal/estadisticas");
            return response.data;
        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
            throw error;
        }
    },

    getUltimosTickets: async () => {
        try {
            const response = await api.get("/panelprincipal/ultimostickets");
            return response.data;
        } catch (error) {
            console.error("Error al obtener últimos tickets:", error);
            throw error;
        }
    }
};