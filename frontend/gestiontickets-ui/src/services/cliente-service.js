import api from '../api/axios';

export const clientesService = {

    //** Función para obtener todos los clientes, con filtros de estado y Nombre/DNI. */
    getAll: async (estadoFiltro, nombreDni = "") => {
        const valorBooleano = estadoFiltro === "activos";
        const response = await api.get('/clientes', {
            params: {
                estado: valorBooleano,
                nombreDni: nombreDni
            }
        });
        return response.data;
    },

    //** Función para crear un nuevo cliente, enviando los datos al endpoint correspondiente. */
    create: async (cliente) => {
        const response = await api.post('/clientes', cliente);
        return response.data;
    },

    //** Función para actualizar un cliente existente, identificado por su ID. */
    update: async (id, cliente) => {
        const response = await api.put(`/clientes/${id}`, cliente);
        return response.data;
    },

    //** Función para eliminar (marcar como eliminado) un cliente por su ID. */
    delete: async (id) => {
        const response = await api.delete(`/clientes/${id}`);
        return response.data;
    },

    //** Función para restaurar un cliente inactivo/eliminado por su ID. */
    restore: async (id) => {
        const response = await api.put(`/clientes/restaurar/${id}`);
        return response.data;
    },

    //** Función para obtener un cliente específico por su ID. */
    getById: async (id) => {
        const response = await api.get(`/clientes/${id}`);
        return response.data;
    },

};