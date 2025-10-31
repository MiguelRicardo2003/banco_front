import { useState, useEffect } from 'react';
import { movimientoService } from '../services/movimiento.service';
import { cuentaService } from '../../cuentas/services/cuenta.service';

export const useMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todos los movimientos
  const fetchMovimientos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await movimientoService.getAll();
      setMovimientos(response.data);
    } catch (err) {
      console.error('Error al cargar movimientos:', err);
      setError('Error al cargar los movimientos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar cuentas disponibles
  const fetchCuentas = async () => {
    try {
      const response = await cuentaService.getAll();
      setCuentas(response.data);
    } catch (err) {
      console.error('Error al cargar cuentas:', err);
    }
  };

  // Crear un nuevo movimiento
  const createMovimiento = async (data) => {
    try {
      const response = await movimientoService.create(data);
      await fetchMovimientos(); // Recargar lista
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error al crear movimiento:', err);
      return { success: false, error: 'Error al crear el movimiento' };
    }
  };

  // Obtener movimientos por cuenta
  const getMovimientosByCuenta = async (idCuenta) => {
    try {
      const response = await movimientoService.getByCuenta(idCuenta);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error al obtener movimientos:', err);
      return { success: false, error: 'Error al obtener movimientos' };
    }
  };

  // Filtrar movimientos por tipo
  const filterByTipo = (tipo) => {
    if (!tipo) return movimientos;
    return movimientos.filter(m => m.IdTipoMovimiento?.toString() === tipo);
  };

  // Cargar datos al montar
  useEffect(() => {
    fetchMovimientos();
    fetchCuentas();
  }, []);

  return {
    movimientos,
    cuentas,
    loading,
    error,
    fetchMovimientos,
    fetchCuentas,
    createMovimiento,
    getMovimientosByCuenta,
    filterByTipo
  };
};
