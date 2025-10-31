import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import Input from './Input';

const FormInput = ({ 
  name, 
  label, 
  type = 'text',
  placeholder = '',
  icon,
  min,
  max,
  step,
  pattern,
  rules = {},
  defaultValue = '',
  ...props 
}) => {
  const { control, formState: { errors } } = useFormContext();
  
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Input
          {...field}
          label={label}
          type={type}
          placeholder={placeholder}
          icon={icon}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          error={errors[name]?.message}
          {...props}
        />
      )}
    />
  );
};

FormInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.elementType,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pattern: PropTypes.string,
  rules: PropTypes.object,
  defaultValue: PropTypes.any
};

export default FormInput;
