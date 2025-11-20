import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from '../components/Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-bbva-gray overflow-hidden">
      {/* Navbar fijo en la parte superior */}
      <div className="flex-shrink-0">
        <Navbar />
      </div>

      {/* Contenedor para Sidebar y Contenido */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar fijo a la izquierda */}
        <div className="flex-shrink-0">
          <Sidebar />
        </div>

        {/* Contenido principal con scroll */}
        <main className="flex-1 overflow-y-auto bg-bbva-gray flex flex-col">
          <div className="flex-1 container mx-auto px-4 py-8">
            {children}
          </div>
          <div className="flex-shrink-0">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
