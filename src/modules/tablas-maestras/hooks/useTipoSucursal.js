import { useState, useEffect } from 'react';
import { tipoSucursalService } from '@services/tipoSucursalService.js';

export const useTipoSucursal = () => {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTipos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tipoSucursalService.getAll();
      setTipos(response.data);
    } catch (err) {
      setError('Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  const createTipo = async (data) => {
    try {
      const response = await tipoSucursalService.create(data);
      await fetchTipos();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Error' };
    }
  };

  const updateTipo = async (id, data) => {
    try {
      const response = await tipoSucursalService.update(id, data);
      await fetchTipos();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Error' };
    }
  };

  const deleteTipo = async (id) => {
    try {
      await tipoSucursalService.delete(id);
      await fetchTipos();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Error' };
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  return { tipos, loading, error, createTipo, updateTipo, deleteTipo };
};

