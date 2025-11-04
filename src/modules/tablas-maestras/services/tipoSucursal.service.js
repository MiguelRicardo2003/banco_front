import apiClient from '@core/services/api';

export const tipoSucursalService = {
  getAll: () => apiClient.get('/tipo-sucursales'),
  getById: (id) => apiClient.get(`/tipo-sucursales/${id}`),
  create: (data) => apiClient.post('/tipo-sucursales', data),
  update: (id, data) => apiClient.put(`/tipo-sucursales/${id}`, data),
  delete: (id) => apiClient.delete(`/tipo-sucursales/${id}`)
};

