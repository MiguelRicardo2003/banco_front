import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '@shared/layout/Layout';
import DashboardPage from '@modules/dashboard/pages/DashboardPage';
import CuentasPage from '@modules/cuentas/pages/CuentasPage';
import MovimientosPage from '@modules/movimientos/pages/MovimientosPage';
import PrestamosPage from '@modules/prestamos/pages/PrestamosPage';
import CiudadPage from '@modules/tablas-maestras/pages/CiudadPage';
import CuentahabientePage from '@modules/tablas-maestras/pages/CuentahabientePage';
import SucursalPage from '@modules/tablas-maestras/pages/SucursalPage';
import TipoDocumentoPage from '@modules/tablas-maestras/pages/TipoDocumentoPage';
import TipoCuentaPage from '@modules/tablas-maestras/pages/TipoCuentaPage';
import TipoSucursalPage from '@modules/tablas-maestras/pages/TipoSucursalPage';
import TipoMovimientoPage from '@modules/tablas-maestras/pages/TipoMovimientoPage';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CUENTAS: '/cuentas',
  MOVIMIENTOS: '/movimientos',
  PRESTAMOS: '/prestamos',
  CIUDAD: '/ciudades',
  CUENTAHABIENTE: '/cuentahabientes',
  SUCURSAL: '/sucursales',
  TIPO_DOCUMENTO: '/tipo-documentos',
  TIPO_CUENTA: '/tipo-cuentas',
  TIPO_SUCURSAL: '/tipo-sucursales',
  TIPO_MOVIMIENTO: '/tipo-movimientos',
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
        <Route path="/ciudades" element={<CiudadPage />} />
        <Route path="/cuentahabientes" element={<CuentahabientePage />} />
        <Route path="/sucursales" element={<SucursalPage />} />
        <Route path="/tipo-documentos" element={<TipoDocumentoPage />} />
        <Route path="/tipo-cuentas" element={<TipoCuentaPage />} />
        <Route path="/tipo-sucursales" element={<TipoSucursalPage />} />
        <Route path="/tipo-movimientos" element={<TipoMovimientoPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
