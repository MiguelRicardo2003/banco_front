/**
 * Formatea un número como moneda colombiana
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0';
  return `$${parseFloat(amount).toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Formatea una fecha en formato legible
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '-';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('es-ES', defaultOptions);
};

/**
 * Formatea una fecha corta (solo números)
 */
export const formatShortDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-ES');
};

/**
 * Formatea fecha y hora
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('es-ES');
};

/**
 * Formatea un número de documento
 */
export const formatDocument = (doc) => {
  if (!doc) return '-';
  return doc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Formatea un número de teléfono
 */
export const formatPhone = (phone) => {
  if (!phone) return '-';
  return phone.toString().replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};

/**
 * Trunca un texto largo
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitaliza la primera letra
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formatea porcentaje
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0%';
  return `${parseFloat(value).toFixed(decimals)}%`;
};
