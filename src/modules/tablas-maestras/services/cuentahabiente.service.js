import apiClient from '@core/services/api';

export const cuentahabienteService = {
  getAll: () => apiClient.get('/cuentahabientes'),
  getById: (id) => apiClient.get(`/cuentahabientes/${id}`),
  create: (data) => apiClient.post('/cuentahabientes', data),
  update: (id, data) => apiClient.put(`/cuentahabientes/${id}`, data),
  delete: (id) => apiClient.delete(`/cuentahabientes/${id}`)
};
