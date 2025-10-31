import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCuentas } from '../hooks/useCuentas';
import Button from '../../../shared/components/Button';
import FormInput from '../../../shared/components/FormInput';
import FormSelect from '../../../shared/components/FormSelect';
import Loading from '../../../shared/components/Loading';

const Cuentas = () => {
  const [filtro, setFiltro] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Hook personalizado
  const { cuentas, loading, error, createCuenta } = useCuentas();

  // React Hook Form
  const methods = useForm({
    defaultValues: {
      Numero: '',
      IdTipoCuenta: '',
      IdSucursal: 1,
      Saldo: 0,
      FechaApertura: new Date().toISOString().split('T')[0]
    }
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    const result = await createCuenta(data);
    if (result.success) {
      toast.success('Cuenta creada exitosamente');
      setShowModal(false);
      reset();
    } else {
      toast.error(result.error || 'Error al crear la cuenta');
    }
  };

  const cuentasFiltradas = cuentas.filter(cuenta =>
    cuenta.Numero.toLowerCase().includes(filtro.toLowerCase()) ||
    cuenta.tipoCuenta?.TipoCuenta.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-bbva-blue">Cuentas</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Nueva Cuenta
        </button>
      </div>

      <div className="card">
        <input
          type="text"
          placeholder="Buscar por número o tipo de cuenta..."
          className="input-field"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600">Total de Cuentas</p>
          <p className="text-2xl font-bold text-bbva-blue">{cuentas.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Saldo Total</p>
          <p className="text-2xl font-bold text-green-600">
            ${cuentas.reduce((sum, c) => sum + parseFloat(c.Saldo || 0), 0).toLocaleString('es-CO')}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Cuentas con Sobregiro</p>
          <p className="text-2xl font-bold text-orange-600">
            {cuentas.filter(c => parseFloat(c.Saldo) < 0).length}
          </p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Tipo</th>
              <th>Sucursal</th>
              <th>Saldo</th>
              <th>Fecha Apertura</th>
              <th>Titular(es)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuentasFiltradas.map(cuenta => (
              <tr key={cuenta.IdCuenta}>
                <td>{cuenta.IdCuenta}</td>
                <td className="font-semibold">{cuenta.Numero}</td>
                <td>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {cuenta.tipoCuenta?.TipoCuenta || 'N/A'}
                  </span>
                </td>
                <td>{cuenta.sucursal?.Sucursal || 'N/A'}</td>
                <td className={`font-bold ${parseFloat(cuenta.Saldo) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${parseFloat(cuenta.Saldo || 0).toLocaleString('es-CO')}
                </td>
                <td>{new Date(cuenta.FechaApertura).toLocaleDateString('es-ES')}</td>
                <td>
                  {cuenta.titulares?.map(t => t.Nombre).join(', ') || 'Sin titular'}
                </td>
                <td>
                  <button className="text-bbva-light-blue hover:underline text-sm">
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-bbva-blue mb-6">Nueva Cuenta</h2>
            
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                  name="Numero"
                  label="Número de Cuenta"
                  placeholder="Ej: 1234567890"
                  rules={{ 
                    required: 'El número de cuenta es requerido',
                    minLength: { value: 6, message: 'Mínimo 6 dígitos' }
                  }}
                />

                <FormSelect
                  name="IdTipoCuenta"
                  label="Tipo de Cuenta"
                  rules={{ required: 'El tipo de cuenta es requerido' }}
                  options={[
                    { value: '', label: 'Seleccione un tipo' },
                    { value: 1, label: 'Ahorros' },
                    { value: 2, label: 'Corriente' },
                    { value: 3, label: 'Nómina' }
                  ]}
                />

                <FormInput
                  name="Saldo"
                  type="number"
                  label="Saldo Inicial"
                  placeholder="0.00"
                  rules={{ 
                    required: 'El saldo inicial es requerido',
                    min: { value: 0, message: 'El saldo no puede ser negativo' }
                  }}
                  step="0.01"
                />

                <FormInput
                  name="FechaApertura"
                  type="date"
                  label="Fecha de Apertura"
                  rules={{ required: 'La fecha de apertura es requerida' }}
                />

                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creando...' : 'Crear Cuenta'}
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

export default Cuentas;
