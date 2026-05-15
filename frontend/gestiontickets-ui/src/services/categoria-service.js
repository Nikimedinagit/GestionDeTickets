import api from '../api/axios';

export const categoriasService = {
  
  getActivas: async () => {
    try {
      const response = await api.get('/categorias/activas');
      return response.data;
    } catch (error) {
      console.error("Error al obtener categorías activas:", error);
      throw error;
    }
  },

  //** Función para obtener todas las categorias, con un filtro de estado que determina si se buscan convenios activas o inactivas. */
  getAll: async (estadoFiltro, descripcion = "") => {
    const valorBooleano = estadoFiltro === "activos";
    const response = await api.get('/categorias', {
      params: {
        estado: valorBooleano,
        descripcion: descripcion
      }
    });
    return response.data;
  },

  //** Función para crear una nueva categoria, enviando los datos de la categoria al endpoint correspondiente. */
  create: async (categoria) => {
    const response = await api.post('/categorias', categoria);
    return response.data;
  },

  //** Función para actualizar una categoria existente, identificada por su ID, con los nuevos datos proporcionados. */
  update: async (id, categoria) => {
    const response = await api.put(`/categorias/${id}`, categoria);
    return response.data;
  },

  //** Función para eliminar una categoria, identificada por su ID, enviando una solicitud de eliminación al endpoint correspondiente. */
  delete: async (id) => {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  },

  //** Función para restaurar una categorias inactiva, identificada por su ID, enviando una solicitud de restauración al endpoint correspondiente. */
  restore: async (id) => {
    const response = await api.put(`/categorias/restaurar/${id}`);
    return response.data;
  },

  //** Función para obtener una categoria específica por su ID. */
  getById: async (id) => {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  }
};