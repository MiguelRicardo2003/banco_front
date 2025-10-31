import { useState, useMemo } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useMovimientos } from '../hooks/useMovimientos';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import Card from '../../../shared/components/Card';
import Table from '../../../shared/components/Table';
import Badge from '../../../shared/components/Badge';
import FormInput from '../../../shared/components/FormInput';
import FormSelect from '../../../shared/components/FormSelect';
import Loading from '../../../shared/components/Loading';
import { formatCurrency } from '../../../shared/utils/formatters';
import { formatShortDate } from '../../../shared/utils/formatters';

const Movimientos = () => {
  const [showModal, setShowModal] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCuenta, setFiltroCuenta] = useState('');

  // Hook personalizado
  const { movimientos, cuentas, loading, error, createMovimiento } = useMovimientos();

  // React Hook Form
  const methods = useForm({
    defaultValues: {
      IdCuenta: '',
      IdSucursal: 1,
      Valor: '',
      IdTipoMovimiento: 1,
      Fecha: new Date().toISOString().split('T')[0],
      Descripcion: ''
    }
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    const result = await createMovimiento(data);
    if (result.success) {
      toast.success('Movimiento registrado exitosamente');
      setShowModal(false);
      reset();
    } else {
      toast.error(result.error || 'Error al registrar movimiento');
    }
  };

  const movimientosFiltrados = useMemo(() => {
    return (movimientos || []).filter(mov => {
      const matchTipo = filtroTipo === '' || mov.tipoMovimiento?.TipoMovimiento === filtroTipo;
      const matchCuenta = filtroCuenta === '' || mov.cuenta?.Numero.includes(filtroCuenta);
      return matchTipo && matchCuenta;
    });
  }, [movimientos, filtroTipo, filtroCuenta]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;

  // Configuración de columnas para la tabla
  const tableColumns = [
    { key: 'IdMovimiento', header: 'ID' },
    { 
      key: 'Fecha', 
      header: 'Fecha',
      render: (value) => formatShortDate(value)
    },
    { 
      key: 'cuenta', 
      header: 'Cuenta',
      render: (value) => <span className="font-semibold">{value?.Numero || 'N/A'}</span>
    },
    { 
      key: 'tipoMovimiento', 
      header: 'Tipo',
      render: (value, row) => {
        const variants = { 1: 'success', 2: 'danger', 3: 'info' };
        return (
          <Badge variant={variants[row.IdTipoMovimiento]} size="sm">
            {value?.TipoMovimiento || 'N/A'}
          </Badge>
        );
      }
    },
    { 
      key: 'Valor', 
      header: 'Valor',
      render: (value, row) => {
        const isPositive = row.IdTipoMovimiento === 1;
        return (
          <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : '-'}{formatCurrency(value)}
          </span>
        );
      }
    },
    { 
      key: 'sucursal', 
      header: 'Sucursal',
      render: (value) => value?.Sucursal || 'N/A'
    },
    { 
      key: 'Descripcion', 
      header: 'Descripción',
      render: (value) => <span className="text-sm text-gray-600">{value || '-'}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-bbva-blue">Movimientos</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Nuevo Movimiento
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filtrar por Tipo
            </label>
            <select 
              className="input-field"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="Deposito">Deposito</option>
              <option value="Retiro">Retiro</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filtrar por Cuenta
            </label>
            <input
              type="text"
              placeholder="Número de cuenta..."
              className="input-field"
              value={filtroCuenta}
              onChange={(e) => setFiltroCuenta(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cuenta</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Sucursal</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {movimientosFiltrados.map(mov => (
              <tr key={mov.IdMovimiento}>
                <td>{mov.IdMovimiento}</td>
                <td>{new Date(mov.Fecha).toLocaleDateString('es-ES')}</td>
                <td className="font-semibold">{mov.cuenta?.Numero || 'N/A'}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${mov.IdTipoMovimiento === 1 ? 'bg-green-100 text-green-800' : ''}
                    ${mov.IdTipoMovimiento === 2 ? 'bg-red-100 text-red-800' : ''}
                    ${mov.IdTipoMovimiento === 3 ? 'bg-blue-100 text-blue-800' : ''}
                  `}>
                    {mov.tipoMovimiento?.TipoMovimiento || 'N/A'}
                  </span>
                </td>
                <td className={`font-bold ${mov.IdTipoMovimiento === 1 ? 'text-green-600' : 'text-red-600'}`}>
                  {mov.IdTipoMovimiento === 1 ? '+' : '-'}
                  ${parseFloat(mov.Valor || 0).toLocaleString('es-CO')}
                </td>
                <td>{mov.sucursal?.Sucursal || 'N/A'}</td>
                <td className="text-sm text-gray-600">{mov.Descripcion || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-bbva-blue mb-6">Nuevo Movimiento</h2>
            
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormSelect
                  name="IdCuenta"
                  label="Cuenta"
                  rules={{ required: 'La cuenta es requerida' }}
                  options={[
                    { value: '', label: 'Seleccione una cuenta' },
                    ...(cuentas || []).map(cuenta => ({
                      value: cuenta.IdCuenta,
                      label: `${cuenta.Numero} - Saldo: ${formatCurrency(cuenta.Saldo)}`
                    }))
                  ]}
                />

                <FormSelect
                  name="IdTipoMovimiento"
                  label="Tipo de Movimiento"
                  rules={{ required: 'El tipo de movimiento es requerido' }}
                  options={[
                    { value: 1, label: 'Deposito' },
                    { value: 2, label: 'Retiro' },
                    { value: 3, label: 'Transferencia' }
                  ]}
                />

                <FormInput
                  name="Valor"
                  type="number"
                  label="Valor"
                  placeholder="0.00"
                  rules={{ 
                    required: 'El valor es requerido',
                    min: { value: 0.01, message: 'El valor debe ser mayor a 0' }
                  }}
                  step="0.01"
                />

                <Controller
                  name="Descripcion"
                  control={methods.control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        {...field}
                        className="input-field"
                        rows={3}
                        placeholder="Descripción del movimiento (opcional)"
                      />
                    </div>
                  )}
                />

                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registrando...' : 'Registrar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setShowModal(false);
                      reset();
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movimientos;
