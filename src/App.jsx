import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './core/routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#004481',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
          },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
