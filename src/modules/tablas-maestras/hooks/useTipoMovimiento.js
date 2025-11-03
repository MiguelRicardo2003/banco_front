import { useState, useEffect } from 'react';
import { tipoMovimientoService } from '@services/tipoMovimientoService.js';

export const useTipoMovimiento = () => {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTipos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tipoMovimientoService.getAll();
      setTipos(response.data);
    } catch (err) {
      setError('Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  const createTipo = async (data) => {
    try {
      const response = await tipoMovimientoService.create(data);
      await fetchTipos();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Error' };
    }
  };

  const updateTipo = async (id, data) => {
    try {
      const response = await tipoMovimientoService.update(id, data);
      await fetchTipos();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Error' };
    }
  };

  const deleteTipo = async (id) => {
    try {
      await tipoMovimientoService.delete(id);
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

