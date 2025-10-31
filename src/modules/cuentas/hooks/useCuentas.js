import { useState, useEffect } from 'react';
import { cuentaService } from '../../../services/cuentaService';

export const useCuentas = () => {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todas las cuentas
  const fetchCuentas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cuentaService.getAll();
      setCuentas(response.data);
    } catch (err) {
      console.error('Error al cargar cuentas:', err);
      setError('Error al cargar las cuentas');
    } finally {
      setLoading(false);
    }
  };

  // Crear una nueva cuenta
  const createCuenta = async (data) => {
    try {
      const response = await cuentaService.create(data);
      await fetchCuentas(); // Recargar lista
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error al crear cuenta:', err);
      return { success: false, error: 'Error al crear la cuenta' };
    }
  };

  // Actualizar una cuenta
  const updateCuenta = async (id, data) => {
    try {
      const response = await cuentaService.update(id, data);
      await fetchCuentas(); // Recargar lista
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error al actualizar cuenta:', err);
      return { success: false, error: 'Error al actualizar la cuenta' };
    }
  };

  // Eliminar una cuenta
  const deleteCuenta = async (id) => {
    try {
      await cuentaService.delete(id);
      await fetchCuentas(); // Recargar lista
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar cuenta:', err);
      return { success: false, error: 'Error al eliminar la cuenta' };
    }
  };

  // Obtener saldo de una cuenta
  const getSaldo = async (id) => {
    try {
      const response = await cuentaService.getSaldo(id);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error al obtener saldo:', err);
      return { success: false, error: 'Error al obtener el saldo' };
    }
  };

  // Cargar cuentas al montar el componente
  useEffect(() => {
    fetchCuentas();
  }, []);

  return {
    cuentas,
    loading,
    error,
    fetchCuentas,
    createCuenta,
    updateCuenta,
    deleteCuenta,
    getSaldo
  };
};
