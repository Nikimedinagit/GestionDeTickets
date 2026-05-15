import api from '../api/axios';

export const puestosService = {

  //** Función para obtener todas las puestos, con un filtro de estado que determina si se buscan puestos activas o inactivas. */
  getAll: async (estadoFiltro, descripcion = "") => {
    const valorBooleano = estadoFiltro === "activos";
    const response = await api.get('/puestos', {
      params: {
        estado: valorBooleano,
        descripcion: descripcion
      }
    });
    return response.data;
  },

  //** Función para crear una nueva puesto, enviando los datos de la puesto al endpoint correspondiente. */
  create: async (puesto) => {
    const response = await api.post('/puestos', puesto);
    return response.data;
  },

  //** Función para actualizar una puesto existente, identificada por su ID, con los nuevos datos proporcionados. */
  update: async (id, puesto) => {
    const response = await api.put(`/puestos/${id}`, puesto);
    return response.data;
  },

  //** Función para eliminar una puesto, identificada por su ID, enviando una solicitud de eliminación al endpoint correspondiente. */
  delete: async (id) => {
    const response = await api.delete(`/puestos/${id}`);
    return response.data;
  },

  //** Función para restaurar una puestos inactiva, identificada por su ID, enviando una solicitud de restauración al endpoint correspondiente. */
  restore: async (id) => {
    const response = await api.put(`/puestos/restaurar/${id}`);
    return response.data;
  },

  //** Función para obtener una puesto específica por su ID. */
  getById: async (id) => {
    const response = await api.get(`/puestos/${id}`);
    return response.data;
  }
};