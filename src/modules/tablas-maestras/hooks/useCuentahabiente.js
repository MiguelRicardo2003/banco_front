import { useState, useEffect } from 'react';
import { cuentahabienteService } from '../services/cuentahabiente.service.js';

export const useCuentahabiente = () => {
  const [cuentahabientes, setCuentahabientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCuentahabientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cuentahabienteService.getAll();
      setCuentahabientes(response.data);
    } catch (err) {
      console.error('Error al cargar cuentahabientes:', err);
      setError('Error al cargar los cuentahabientes');
    } finally {
      setLoading(false);
    }
  };

  const createCuentahabiente = async (data) => {
    try {
      const response = await cuentahabienteService.create(data);
      await fetchCuentahabientes();
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error al crear cuentahabiente:', err);
      return { success: false, error: err.response?.data?.error || 'Error al crear el cuentahabiente' };
    }
  };

  const updateCuentahabiente = async (id, data) => {
    try {
      const response = await cuentahabienteService.update(id, data);
      await fetchCuentahabientes();
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error al actualizar cuentahabiente:', err);
      return { success: false, error: err.response?.data?.error || 'Error al actualizar el cuentahabiente' };
    }
  };

  const deleteCuentahabiente = async (id) => {
    try {
      await cuentahabienteService.delete(id);
      await fetchCuentahabientes();
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar cuentahabiente:', err);
      return { success: false, error: err.response?.data?.error || 'Error al eliminar el cuentahabiente' };
    }
  };

  useEffect(() => {
    fetchCuentahabientes();
  }, []);

  return {
    cuentahabientes,
    loading,
    error,
    fetchCuentahabientes,
    createCuentahabiente,
    updateCuentahabiente,
    deleteCuentahabiente
  };
};

