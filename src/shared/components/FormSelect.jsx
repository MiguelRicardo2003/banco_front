import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import Select from './Select';

const FormSelect = ({ 
  name, 
  label, 
  options = [],
  placeholder,
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
        <Select
          {...field}
          label={label}
          options={options}
          placeholder={placeholder}
          error={errors[name]?.message}
          {...props}
        />
      )}
    />
  );
};

FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  placeholder: PropTypes.string,
  rules: PropTypes.object,
  defaultValue: PropTypes.any
};

export default FormSelect;
