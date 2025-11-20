import apiClient from '@core/services/api';

export const ciudadService = {
  getAll: () => apiClient.get('/ciudades'),
  getById: (id) => apiClient.get(`/ciudades/${id}`),
  create: (data) => apiClient.post('/ciudades', data),
  update: (id, data) => apiClient.put(`/ciudades/${id}`, data),
  delete: (id) => apiClient.delete(`/ciudades/${id}`)
};

