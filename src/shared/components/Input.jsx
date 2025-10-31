import PropTypes from 'prop-types';

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  className = '',
  icon: Icon,
  min,
  max,
  step,
  pattern
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          className={`
            w-full px-4 py-2.5 border rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-bbva-blue focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          `}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.elementType,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pattern: PropTypes.string
};

export default Input;
