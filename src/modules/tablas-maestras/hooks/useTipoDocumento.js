import { useState, useEffect } from 'react';
import { tipoDocumentoService } from '../services/tipoDocumento.service.js';

export const useTipoDocumento = () => {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTipos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tipoDocumentoService.getAll();
      setTipos(response.data);
    } catch (err) {
      console.error('Error al cargar tipos:', err);
      setError('Error al cargar los tipos de documento');
    } finally {
      setLoading(false);
    }
  };

  const createTipo = async (data) => {
    try {
      const response = await tipoDocumentoService.create(data);
      await fetchTipos();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Error al crear' };
    }
  };

  const updateTipo = async (id, data) => {
    try {
      const response = await tipoDocumentoService.update(id, data);
      await fetchTipos();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Error al actualizar' };
    }
  };

  const deleteTipo = async (id) => {
    try {
      await tipoDocumentoService.delete(id);
      await fetchTipos();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Error al eliminar' };
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  return { tipos, loading, error, createTipo, updateTipo, deleteTipo };
};

