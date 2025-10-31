import { useState, useEffect } from 'react';
import { cuentaService } from '../../cuentas/services/cuenta.service';
import { movimientoService } from '../../movimientos/services/movimiento.service';
import { prestamoService } from '../../prestamos/services/prestamo.service';

export const useDashboard = () => {
  const [cuentas, setCuentas] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todos los datos del dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [cuentasRes, movimientosRes, prestamosRes] = await Promise.all([
        cuentaService.getAll(),
        movimientoService.getAll(),
        prestamoService.getAll()
      ]);

      setCuentas(cuentasRes.data);
      setMovimientos(movimientosRes.data);
      setPrestamos(prestamosRes.data);
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Calcular balance total
  const getTotalBalance = () => {
    return cuentas.reduce((sum, cuenta) => sum + parseFloat(cuenta.Saldo || 0), 0);
  };

  // Calcular total de préstamos activos
  const getTotalPrestamos = () => {
    return prestamos
      .filter(p => p.Estado === 'Activo' || p.Estado === 'activo')
      .reduce((sum, p) => sum + parseFloat(p.MontoTotal || 0), 0);
  };

  // Obtener últimos movimientos (top N)
  const getUltimosMovimientos = (count = 5) => {
    return movimientos
      .sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha))
      .slice(0, count);
  };

  // Calcular estadísticas de movimientos por tipo
  const getMovimientosPorTipo = () => {
    const tipos = {};
    movimientos.forEach(mov => {
      const tipo = mov.TipoMovimiento?.TipoMovimiento || 'Otros';
      tipos[tipo] = (tipos[tipo] || 0) + 1;
    });
    return tipos;
  };

  // Datos para gráfico de barras
  const getChartData = () => {
    const data = [];
    cuentas.slice(0, 5).forEach(cuenta => {
      data.push({
        name: cuenta.NumeroCuenta || 'N/A',
        saldo: parseFloat(cuenta.Saldo || 0)
      });
    });
    return data;
  };

  // Cargar datos al montar
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    cuentas,
    movimientos,
    prestamos,
    loading,
    error,
    fetchDashboardData,
    getTotalBalance,
    getTotalPrestamos,
    getUltimosMovimientos,
    getMovimientosPorTipo,
    getChartData
  };
};
