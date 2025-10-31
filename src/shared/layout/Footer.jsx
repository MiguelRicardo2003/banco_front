const Footer = () => {
  return (
    <footer className="bg-bbva-blue text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Banco BBVA. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
