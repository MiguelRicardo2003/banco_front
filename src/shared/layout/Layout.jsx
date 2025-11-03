import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from '../components/Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-bbva-gray">
      <Navbar />

      <div className="flex flex-grow">
        {/* Sidebar fijo a la izquierda */}
        <Sidebar />

        {/* Contenido principal */}
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
