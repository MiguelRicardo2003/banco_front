import { useState, useEffect } from 'react';
import { prestamoService } from '../../../services/prestamoService';
import { cuentaService } from '../../../services/cuentaService';

export const usePrestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todos los préstamos
  const fetchPrestamos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await prestamoService.getAll();
      setPrestamos(response.data);
    } catch (err) {
      console.error('Error al cargar préstamos:', err);
      setError('Error al cargar los préstamos');
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

  // Solicitar un nuevo préstamo
  const createPrestamo = async (data) => {
    try {
      const response = await prestamoService.create(data);
      await fetchPrestamos(); // Recargar lista
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error al solicitar préstamo:', err);
      return { success: false, error: 'Error al solicitar el préstamo' };
    }
  };

  // Pagar cuota de préstamo
  const pagarCuota = async (id, data) => {
    try {
      const response = await prestamoService.pagarCuota(id, data);
      await fetchPrestamos(); // Recargar lista
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error al pagar cuota:', err);
      return { success: false, error: 'Error al pagar la cuota' };
    }
  };

  // Calcular cuota mensual
  const calcularCuota = (monto, tasaAnual, meses) => {
    const tasaMensual = tasaAnual / 100 / 12;
    const cuota = (monto * tasaMensual * Math.pow(1 + tasaMensual, meses)) / 
                  (Math.pow(1 + tasaMensual, meses) - 1);
    return cuota;
  };

  // Cargar datos al montar
  useEffect(() => {
    fetchPrestamos();
    fetchCuentas();
  }, []);

  return {
    prestamos,
    cuentas,
    loading,
    error,
    fetchPrestamos,
    fetchCuentas,
    createPrestamo,
    pagarCuota,
    calcularCuota
  };
};
