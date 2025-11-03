import { Link } from 'react-router-dom';
import { ROUTES } from '@core/routes/AppRoutes';

const Navbar = () => {
  return (
    <nav className="bg-bbva-blue text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to={ROUTES.DASHBOARD} 
            className="flex items-center space-x-2"
          >
            <div className="text-2xl font-bold">BBVA</div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
