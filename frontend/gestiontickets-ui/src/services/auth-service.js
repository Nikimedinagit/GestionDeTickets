import api from '../api/axios';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/Auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/Auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login'; 
  }
};