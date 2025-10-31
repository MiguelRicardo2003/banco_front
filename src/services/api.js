import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejo de errores global
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
