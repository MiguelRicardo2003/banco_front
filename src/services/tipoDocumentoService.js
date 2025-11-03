import apiClient from '@core/services/api';

export const tipoDocumentoService = {
  getAll: () => apiClient.get('/tipo-documentos'),
  getById: (id) => apiClient.get(`/tipo-documentos/${id}`),
  create: (data) => apiClient.post('/tipo-documentos', data),
  update: (id, data) => apiClient.put(`/tipo-documentos/${id}`, data),
  delete: (id) => apiClient.delete(`/tipo-documentos/${id}`)
};

