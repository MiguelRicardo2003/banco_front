import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  variant = 'default',
  padding = 'default',
  hoverable = false,
  onClick,
  footer
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md transition-all duration-200';
  
  // Variantes de colores más sobrias - tonos corporativos
  const variantClasses = {
    default: '',
    primary: 'border-l-4 border-bbva-blue',
    success: 'border-l-4 border-gray-600',
    warning: 'border-l-4 border-gray-500',
    danger: 'border-l-4 border-gray-700',
    gradient: 'bg-gradient-to-br from-bbva-blue to-blue-800 text-white'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    default: 'p-6',
    lg: 'p-8'
  };
  
  const hoverClasses = hoverable ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : '';

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className={`text-xl font-bold mb-1 ${variant === 'gradient' ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className={`text-sm ${variant === 'gradient' ? 'text-gray-200' : 'text-gray-600'}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="card-content">
        {children}
      </div>
      
      {footer && (
        <div className={`mt-4 pt-4 border-t ${variant === 'gradient' ? 'border-white/20' : 'border-gray-200'}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'gradient']),
  padding: PropTypes.oneOf(['none', 'sm', 'default', 'lg']),
  hoverable: PropTypes.bool,
  onClick: PropTypes.func,
  footer: PropTypes.node
};

export default Card;
