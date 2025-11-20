import apiClient from '@core/services/api';

export const cuentaService = {
  getAll: () => apiClient.get('/cuentas'),
  getById: (id) => apiClient.get(`/cuentas/${id}`),
  getSaldo: (id) => apiClient.get(`/cuentas/${id}/saldo`),
  create: (data) => apiClient.post('/cuentas', data),
  update: (id, data) => apiClient.put(`/cuentas/${id}`, data),
  delete: (id) => apiClient.delete(`/cuentas/${id}`)
};
