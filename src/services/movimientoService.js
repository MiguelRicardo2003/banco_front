import apiClient from './api';

export const movimientoService = {
  getAll: () => apiClient.get('/movimientos'),
  getById: (id) => apiClient.get(`/movimientos/${id}`),
  getByCuenta: (idCuenta) => apiClient.get(`/movimientos/cuenta/${idCuenta}`),
  create: (data) => apiClient.post('/movimientos', data)
};
