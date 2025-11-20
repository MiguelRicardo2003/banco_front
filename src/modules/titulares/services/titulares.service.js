import api from '../../../core/services/api';

export const getTitulares = async () => {
  const response = await api.get('/titulares');
  return response.data;
};
