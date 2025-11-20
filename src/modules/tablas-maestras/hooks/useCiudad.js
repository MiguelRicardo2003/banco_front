import { useState, useEffect } from 'react';
import { ciudadService } from '../services/ciudad.service.js';

export const useCiudad = () => {
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCiudades = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ciudadService.getAll();
      setCiudades(response.data);
    } catch (err) {
      console.error('Error al cargar ciudades:', err);
      setError('Error al cargar las ciudades');
    } finally {
      setLoading(false);
    }
  };

  const createCiudad = async (data) => {
    try {
      const response = await ciudadService.create(data);
      await fetchCiudades();
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error al crear ciudad:', err);
      return { success: false, error: err.response?.data?.error || 'Error al crear la ciudad' };
    }
  };

  const updateCiudad = async (id, data) => {
    try {
      const response = await ciudadService.update(id, data);
      await fetchCiudades();
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error al actualizar ciudad:', err);
      return { success: false, error: err.response?.data?.error || 'Error al actualizar la ciudad' };
    }
  };

  const deleteCiudad = async (id) => {
    try {
      await ciudadService.delete(id);
      await fetchCiudades();
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar ciudad:', err);
      return { success: false, error: err.response?.data?.error || 'Error al eliminar la ciudad' };
    }
  };

  useEffect(() => {
    fetchCiudades();
  }, []);

  return {
    ciudades,
    loading,
    error,
    fetchCiudades,
    createCiudad,
    updateCiudad,
    deleteCiudad
  };
};

