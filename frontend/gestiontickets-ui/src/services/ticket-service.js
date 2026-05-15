import api from '../api/axios';

export const ticketsService = {

    //** Función para obtener todos tickets, con un filtro de estado que determina si se buscan tickets activas o finalizados. */
    getAll: async (estadoFiltro, busqueda = "", filtros = {}) => {
    const grupoEstado = estadoFiltro === "activos" ? 1 : 2;

    const response = await api.get('/tickets', {
        params: {
            grupoEstado: grupoEstado,
            titulo: busqueda?.trim() || undefined,
            categoriaID: filtros.CategoriaID || undefined,
            prioridad: filtros.Prioridad || undefined,
            estado: filtros.Estado || undefined,
            fechaInicio: filtros.FechaInicio ? filtros.FechaInicio.toISOString() : undefined,
            fechaFin: filtros.FechaFin ? filtros.FechaFin.toISOString() : undefined,
        }
    });

    return response.data;
},

    //** Función para crear un nuevo ticket */
    create: async (nuevoTicket) => {
        const response = await api.post('/tickets', nuevoTicket);
        return response.data;
    },

    //** Función para actualizar un ticket existente */
    update: async (id, ticket) => {
        const response = await api.put(`/tickets/${id}`, ticket);
        return response.data;
    },

    //** Función para iniciar el proceso de un ticket */
    iniciar: async (id) => {
        const response = await api.put(`/tickets/proceso/${id}`);
        return response.data;
    },

    //** Función para cerrar un ticket */
    cerrar: async (id, comentario) => {
        const response = await api.put(`/tickets/cerrar/${id}`, {
            comentario: comentario
        });

        return response.data;
    },

    //** Función para cancelar un ticket */
    cancelar: async (id, comentario) => {
        const response = await api.put(`/tickets/cancelar/${id}`, {
            comentario: comentario
        });

        return response.data;
    }

};