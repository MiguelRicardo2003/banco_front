import { useState, useEffect } from 'react';
import { getTitulares } from '../services/titulares.service';
import { showErrorToast } from '../../../shared/utils/toast';

export const useTitulares = () => {
  const [titulares, setTitulares] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTitulares = async () => {
    setLoading(true);
    try {
      const data = await getTitulares();
      setTitulares(data);
    } catch (error) {
      showErrorToast('Error al cargar los titulares');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTitulares();
  }, []);

  return {
    titulares,
    loading,
    refreshTitulares: fetchTitulares
  };
};
