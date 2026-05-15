import api from '../api/axios';

export const desarrolladoresService = {

    //** Función para obtener todos los desarrolladores, con filtros de estado y Nombre/DNI. */
    getAll: async (estadoFiltro, nombreDniPuesto = "") => {
        const valorBooleano = estadoFiltro === "activos";
        const response = await api.get('/desarrolladores', {
            params: {
                estado: valorBooleano,
                nombreDniPuesto: nombreDniPuesto
            }
        });
        return response.data;
    },

    //** Función para crear un nuevo desarrollador, enviando los datos al endpoint correspondiente. */
    create: async (cliente) => {
        const response = await api.post('/desarrolladores', cliente);
        return response.data;
    },

    //** Función para actualizar un desarrollador existente, identificado por su ID. */
    update: async (id, cliente) => {
        const response = await api.put(`/desarrolladores/${id}`, cliente);
        return response.data;
    },

    //** Función para eliminar (marcar como eliminado) un cliente por su ID. */
    delete: async (id) => {
        const response = await api.delete(`/desarrolladores/${id}`);
        return response.data;
    },

    //** Función para restaurar un desarrollador inactivo/eliminado por su ID. */
    restore: async (id) => {
        const response = await api.put(`/desarrolladores/restaurar/${id}`);
        return response.data;
    },

    //** Función para obtener un desarrollador específico por su ID. */
    getById: async (id) => {
        const response = await api.get(`/desarrolladores/${id}`);
        return response.data;
    },
};