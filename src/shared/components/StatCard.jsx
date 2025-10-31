import PropTypes from 'prop-types';
import Card from './Card';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  variant = 'primary',
  trend,
  trendValue,
  className = ''
}) => {
  // Colores corporativos más sobrios - tonos de azul y gris
  const variantColors = {
    primary: 'from-bbva-blue to-blue-700',
    success: 'from-gray-600 to-gray-700',
    warning: 'from-gray-500 to-gray-600',
    danger: 'from-gray-700 to-gray-800',
    info: 'from-blue-600 to-blue-700'
  };

  return (
    <Card 
      variant="gradient" 
      className={`bg-gradient-to-br ${variantColors[variant]} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
              {trend === 'up' ? '↑' : '↓'}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className="bg-white/20 rounded-full p-3">
            <Icon className="h-8 w-8 text-white" />
          </div>
        )}
      </div>
    </Card>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  variant: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'info']),
  trend: PropTypes.oneOf(['up', 'down']),
  trendValue: PropTypes.string,
  className: PropTypes.string
};

export default StatCard;
