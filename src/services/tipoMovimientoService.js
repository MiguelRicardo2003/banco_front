import apiClient from '@core/services/api';

export const tipoMovimientoService = {
  getAll: () => apiClient.get('/tipo-movimientos'),
  getById: (id) => apiClient.get(`/tipo-movimientos/${id}`),
  create: (data) => apiClient.post('/tipo-movimientos', data),
  update: (id, data) => apiClient.put(`/tipo-movimientos/${id}`, data),
  delete: (id) => apiClient.delete(`/tipo-movimientos/${id}`)
};

