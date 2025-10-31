/**
 * Valida si un campo es requerido
 */
export const required = (value, fieldName = 'Este campo') => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} es requerido`;
  }
  return '';
};

/**
 * Valida longitud mínima
 */
export const minLength = (value, min, fieldName = 'Este campo') => {
  if (value && value.toString().length < min) {
    return `${fieldName} debe tener al menos ${min} caracteres`;
  }
  return '';
};

/**
 * Valida longitud máxima
 */
export const maxLength = (value, max, fieldName = 'Este campo') => {
  if (value && value.toString().length > max) {
    return `${fieldName} no puede tener más de ${max} caracteres`;
  }
  return '';
};

/**
 * Valida formato de email
 */
export const email = (value, fieldName = 'Email') => {
  if (!value) return '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return `${fieldName} no es válido`;
  }
  return '';
};

/**
 * Valida número positivo
 */
export const positive = (value, fieldName = 'Este campo') => {
  if (value && parseFloat(value) <= 0) {
    return `${fieldName} debe ser un número positivo`;
  }
  return '';
};

/**
 * Valida rango numérico
 */
export const range = (value, min, max, fieldName = 'Este campo') => {
  const num = parseFloat(value);
  if (isNaN(num) || num < min || num > max) {
    return `${fieldName} debe estar entre ${min} y ${max}`;
  }
  return '';
};

/**
 * Valida que sea un número
 */
export const isNumber = (value, fieldName = 'Este campo') => {
  if (value && isNaN(parseFloat(value))) {
    return `${fieldName} debe ser un número válido`;
  }
  return '';
};

/**
 * Valida formato de fecha
 */
export const date = (value, fieldName = 'Fecha') => {
  if (!value) return '';
  const dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) {
    return `${fieldName} no es válida`;
  }
  return '';
};

/**
 * Valida que la fecha no sea futura
 */
export const pastDate = (value, fieldName = 'Fecha') => {
  if (!value) return '';
  const inputDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (inputDate > today) {
    return `${fieldName} no puede ser futura`;
  }
  return '';
};

/**
 * Valida patrón regex
 */
export const pattern = (value, regex, message) => {
  if (value && !regex.test(value)) {
    return message || 'Formato no válido';
  }
  return '';
};

/**
 * Ejecuta múltiples validaciones
 */
export const validate = (value, validations = []) => {
  for (const validation of validations) {
    const error = validation(value);
    if (error) return error;
  }
  return '';
};
