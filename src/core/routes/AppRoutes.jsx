import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '../../shared/layout/Layout';
import DashboardPage from '../../modules/dashboard/pages/DashboardPage';
import CuentasPage from '../../modules/cuentas/pages/CuentasPage';
import MovimientosPage from '../../modules/movimientos/pages/MovimientosPage';
import PrestamosPage from '../../modules/prestamos/pages/PrestamosPage';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CUENTAS: '/cuentas',
  MOVIMIENTOS: '/movimientos',
  PRESTAMOS: '/prestamos',
  NOT_FOUND: '*'
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route element={<Layout><Outlet /></Layout>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cuentas" element={<CuentasPage />} />
        <Route path="/movimientos" element={<MovimientosPage />} />
        <Route path="/prestamos" element={<PrestamosPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
