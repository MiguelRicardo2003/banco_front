import PropTypes from 'prop-types';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  rounded = false,
  className = ''
}) => {
  // Colores más sobrios y corporativos
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-bbva-blue text-white',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };
  
  const roundedClass = rounded ? 'rounded-full' : 'rounded';

  return (
    <span 
      className={`
        inline-flex items-center font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${roundedClass}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  rounded: PropTypes.bool,
  className: PropTypes.string
};

export default Badge;
