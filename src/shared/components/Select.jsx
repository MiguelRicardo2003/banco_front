import PropTypes from 'prop-types';

const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [],
  required = false,
  disabled = false,
  error = '',
  className = '',
  placeholder = 'Seleccione una opción'
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
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 border rounded-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-bbva-blue focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          bg-white cursor-pointer
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
        `}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option, index) => (
          <option 
            key={option.value || index} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      
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

Select.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string
};

export default Select;
