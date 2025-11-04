import { useState, useEffect } from 'react';
import { movimientoService } from '../services/movimiento.service';
import { cuentaService } from '../../cuentas/services/cuenta.service';
import { tipoMovimientoService } from '@services/tipoMovimientoService';
import { sucursalService } from '@services/sucursalService';

export const useMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [tiposMovimiento, setTiposMovimiento] = useState([]);
  const [sucursales, setSucursales] = useState([]);
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

  // Cargar tipos de movimiento
  const fetchTiposMovimiento = async () => {
    try {
      const response = await tipoMovimientoService.getAll();
      setTiposMovimiento(response.data || []);
    } catch (err) {
      console.error('Error al cargar tipos de movimiento:', err);
    }
  };

  // Cargar sucursales
  const fetchSucursales = async () => {
    try {
      const response = await sucursalService.getAll();
      setSucursales(response.data || []);
    } catch (err) {
      console.error('Error al cargar sucursales:', err);
    }
  };

  // Crear un nuevo movimiento
  const createMovimiento = async (data) => {
    try {
      console.log('Datos a enviar:', data);
      const response = await movimientoService.create(data);
      await fetchMovimientos(); // Recargar lista
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error al crear movimiento:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.errors?.join(', ') || 
                          err.message || 
                          'Error al crear el movimiento';
      return { success: false, error: errorMessage };
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
    fetchTiposMovimiento();
    fetchSucursales();
  }, []);

  return {
    movimientos,
    cuentas,
    tiposMovimiento,
    sucursales,
    loading,
    error,
    fetchMovimientos,
    fetchCuentas,
    createMovimiento,
    getMovimientosByCuenta,
    filterByTipo
  };
};
