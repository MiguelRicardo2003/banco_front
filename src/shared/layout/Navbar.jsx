import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, CreditCard, ArrowLeftRight, DollarSign } from 'lucide-react';
import { ROUTES } from '../../core/routes/AppRoutes';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-bbva-light-blue' : '';
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: Home },
    { path: ROUTES.CUENTAS, label: 'Cuentas', icon: CreditCard },
    { path: ROUTES.MOVIMIENTOS, label: 'Movimientos', icon: ArrowLeftRight },
    { path: ROUTES.PRESTAMOS, label: 'Préstamos', icon: DollarSign }
  ];

  return (
    <nav className="bg-bbva-blue text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to={ROUTES.DASHBOARD} 
            className="flex items-center space-x-2 z-50"
            onClick={handleLinkClick}
          >
            <div className="text-2xl font-bold">BBVA</div>
          </Link>
          
          <div className="hidden md:flex space-x-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link 
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-bbva-light-blue transition-colors ${isActive(path)}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* ...existing code... */}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden z-50 p-2 hover:bg-bbva-light-blue rounded transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div 
          className={`
            md:hidden fixed inset-0 top-16 left-0 right-0 bottom-0 bg-bbva-blue z-40
            transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded hover:bg-bbva-light-blue transition-colors ${isActive(path)}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-lg">{label}</span>
              </Link>
            ))}

            {/* ...existing code... */}
          </div>
        </div>

        {isMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30 top-16"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
