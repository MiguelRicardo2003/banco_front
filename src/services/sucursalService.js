import apiClient from '@core/services/api';

export const sucursalService = {
  getAll: () => apiClient.get('/sucursales'),
  getById: (id) => apiClient.get(`/sucursales/${id}`),
  create: (data) => apiClient.post('/sucursales', data),
  update: (id, data) => apiClient.put(`/sucursales/${id}`, data),
  delete: (id) => apiClient.delete(`/sucursales/${id}`)
};
