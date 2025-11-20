import { useState, useEffect } from 'react';
import { sucursalService } from '../services/sucursal.service.js';

export const useSucursal = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSucursales = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sucursalService.getAll();
      setSucursales(response.data);
    } catch (err) {
      console.error('Error al cargar sucursales:', err);
      setError('Error al cargar las sucursales');
    } finally {
      setLoading(false);
    }
  };

  const createSucursal = async (data) => {
    try {
      const response = await sucursalService.create(data);
      await fetchSucursales();
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error al crear sucursal:', err);
      return { success: false, error: err.response?.data?.error || 'Error al crear la sucursal' };
    }
  };

  const updateSucursal = async (id, data) => {
    try {
      const response = await sucursalService.update(id, data);
      await fetchSucursales();
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error al actualizar sucursal:', err);
      return { success: false, error: err.response?.data?.error || 'Error al actualizar la sucursal' };
    }
  };

  const deleteSucursal = async (id) => {
    try {
      await sucursalService.delete(id);
      await fetchSucursales();
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar sucursal:', err);
      return { success: false, error: err.response?.data?.error || 'Error al eliminar la sucursal' };
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  return {
    sucursales,
    loading,
    error,
    fetchSucursales,
    createSucursal,
    updateSucursal,
    deleteSucursal
  };
};

