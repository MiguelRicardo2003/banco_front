import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  Building2,
  FileText,
  Landmark,
  MapPin,
  ClipboardList,
  CreditCard,
  ArrowLeftRight,
  DollarSign,
  Home,
  User,
  Users
} from 'lucide-react';
import { ROUTES } from '@core/routes/AppRoutes';

const Sidebar = () => {
  const location = useLocation();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-bbva-blue text-white h-full shadow-xl p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-center">Menú Principal</h2>

      <Link 
        to={ROUTES.DASHBOARD} 
        className={`flex items-center gap-2 px-2 py-2 mb-4 font-semibold hover:bg-bbva-light-blue rounded transition ${isActive(ROUTES.DASHBOARD) ? 'bg-bbva-light-blue' : ''}`}
      >
        <Home className="w-4 h-4" /> Dashboard
      </Link>

      {/* Sección Tablas Maestras */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('maestras')}
          className="flex items-center justify-between w-full px-2 py-2 font-semibold hover:bg-bbva-light-blue rounded transition"
        >
          <span className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" /> Tablas Maestras
          </span>
          {openSection === 'maestras' ? <ChevronDown /> : <ChevronRight />}
        </button>
        {openSection === 'maestras' && (
          <div className="ml-6 mt-2 flex flex-col space-y-1">
            <Link to={ROUTES.CIUDAD} className={`hover:bg-bbva-light-blue rounded px-2 py-1 ${isActive(ROUTES.CIUDAD) ? 'bg-bbva-light-blue' : ''}`}>
              <MapPin className="inline w-4 h-4 mr-2" /> Ciudad
            </Link>
            <Link to={ROUTES.SUCURSAL} className={`hover:bg-bbva-light-blue rounded px-2 py-1 ${isActive(ROUTES.SUCURSAL) ? 'bg-bbva-light-blue' : ''}`}>
              <Building2 className="inline w-4 h-4 mr-2" /> Sucursal
            </Link>
            <Link to={ROUTES.TIPO_DOCUMENTO} className={`hover:bg-bbva-light-blue rounded px-2 py-1 ${isActive(ROUTES.TIPO_DOCUMENTO) ? 'bg-bbva-light-blue' : ''}`}>
              <FileText className="inline w-4 h-4 mr-2" /> Tipo Documento
            </Link>
            <Link to={ROUTES.TIPO_CUENTA} className={`hover:bg-bbva-light-blue rounded px-2 py-1 ${isActive(ROUTES.TIPO_CUENTA) ? 'bg-bbva-light-blue' : ''}`}>
              <CreditCard className="inline w-4 h-4 mr-2" /> Tipo Cuenta
            </Link>
            <Link to={ROUTES.TIPO_SUCURSAL} className={`hover:bg-bbva-light-blue rounded px-2 py-1 ${isActive(ROUTES.TIPO_SUCURSAL) ? 'bg-bbva-light-blue' : ''}`}>
              <Building2 className="inline w-4 h-4 mr-2" /> Tipo Sucursal
            </Link>
            <Link to={ROUTES.TIPO_MOVIMIENTO} className={`hover:bg-bbva-light-blue rounded px-2 py-1 ${isActive(ROUTES.TIPO_MOVIMIENTO) ? 'bg-bbva-light-blue' : ''}`}>
              <Landmark className="inline w-4 h-4 mr-2" /> Tipo Movimiento
            </Link>
          </div>
        )}
      </div>

      {/* Sección Operaciones */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('operaciones')}
          className="flex items-center justify-between w-full px-2 py-2 font-semibold hover:bg-bbva-light-blue rounded transition"
        >
          <span className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Operaciones
          </span>
          {openSection === 'operaciones' ? <ChevronDown /> : <ChevronRight />}
        </button>
        {openSection === 'operaciones' && (
          <div className="ml-6 mt-2 flex flex-col space-y-1">
            <Link to={ROUTES.CUENTAHABIENTE} className={`hover:bg-bbva-light-blue rounded px-2 py-1 ${isActive(ROUTES.CUENTAHABIENTE) ? 'bg-bbva-light-blue' : ''}`}>
              <User className="inline w-4 h-4 mr-2" /> Cuentahabientes
            </Link>
            <Link to={ROUTES.CUENTAS} className={`hover:bg-bbva-light-blue rounded px-2 py-1 ${isActive(ROUTES.CUENTAS) ? 'bg-bbva-light-blue' : ''}`}>
              <CreditCard className="inline w-4 h-4 mr-2" /> Cuentas
            </Link>
            <Link to={ROUTES.MOVIMIENTOS} className={`hover:bg-bbva-light-blue rounded px-2 py-1 ${isActive(ROUTES.MOVIMIENTOS) ? 'bg-bbva-light-blue' : ''}`}>
              <ArrowLeftRight className="inline w-4 h-4 mr-2" /> Movimientos
            </Link>
            <Link to={ROUTES.PRESTAMOS} className={`hover:bg-bbva-light-blue rounded px-2 py-1 ${isActive(ROUTES.PRESTAMOS) ? 'bg-bbva-light-blue' : ''}`}>
              <DollarSign className="inline w-4 h-4 mr-2" /> Préstamos
            </Link>
            <Link to={ROUTES.TITULARES} className={`hover:bg-bbva-light-blue rounded px-2 py-1 ${isActive(ROUTES.TITULARES) ? 'bg-bbva-light-blue' : ''}`}>
              <Users className="inline w-4 h-4 mr-2" /> Titulares
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
