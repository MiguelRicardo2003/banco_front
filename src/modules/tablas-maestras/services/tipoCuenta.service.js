import apiClient from '@core/services/api';

export const tipoCuentaService = {
  getAll: () => apiClient.get('/tipo-cuentas'),
  getById: (id) => apiClient.get(`/tipo-cuentas/${id}`),
  create: (data) => apiClient.post('/tipo-cuentas', data),
  update: (id, data) => apiClient.put(`/tipo-cuentas/${id}`, data),
  delete: (id) => apiClient.delete(`/tipo-cuentas/${id}`)
};

