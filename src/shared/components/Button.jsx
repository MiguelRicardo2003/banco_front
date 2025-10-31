import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  type = 'button',
  className = '',
  icon: Icon,
  loading = false
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-bbva-blue hover:bg-bbva-dark-blue text-white shadow-md hover:shadow-lg',
    secondary: 'bg-bbva-light-blue hover:bg-bbva-blue text-white shadow-md hover:shadow-lg',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-bbva-blue text-bbva-blue hover:bg-bbva-blue hover:text-white',
    ghost: 'text-bbva-blue hover:bg-gray-100'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Cargando...
        </>
      ) : (
        <>
          {Icon && <Icon className="h-5 w-5" />}
          {children}
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  icon: PropTypes.elementType,
  loading: PropTypes.bool
};

export default Button;
