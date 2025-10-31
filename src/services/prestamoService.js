import apiClient from './api';

export const prestamoService = {
  getAll: () => apiClient.get('/prestamos'),
  getById: (id) => apiClient.get(`/prestamos/${id}`),
  getByCuenta: (idCuenta) => apiClient.get(`/prestamos/cuenta/${idCuenta}`),
  create: (data) => apiClient.post('/prestamos', data),
  update: (id, data) => apiClient.put(`/prestamos/${id}`, data),
  delete: (id) => apiClient.delete(`/prestamos/${id}`)
};
