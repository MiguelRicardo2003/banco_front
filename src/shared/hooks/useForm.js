import { useState } from 'react';

export const useForm = (initialValues = {}, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo al cambiar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e, validationFn) => {
    e.preventDefault();
    
    // Validar si se proporciona función de validación
    if (validationFn) {
      const validationErrors = validationFn(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      reset();
    } catch (error) {
      console.error('Error en el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  const setFieldValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const setFieldError = (name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    setValues,
    setErrors
  };
};
