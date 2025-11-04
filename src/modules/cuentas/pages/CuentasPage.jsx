import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Eye, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCuentas } from '../hooks/useCuentas';
import { tipoCuentaService } from '@modules/tablas-maestras/services/tipoCuenta.service';
import { sucursalService } from '@modules/tablas-maestras/services/sucursal.service';
import { cuentahabienteService } from '@modules/tablas-maestras/services/cuentahabiente.service';
import Button from '@shared/components/Button';
import FormInput from '@shared/components/FormInput';
import FormSelect from '@shared/components/FormSelect';
import Loading from '@shared/components/Loading';
import Table from '@shared/components/Table';
import Modal from '@shared/components/Modal';
import ConfirmModal from '@shared/components/ConfirmModal';
import MessageModal from '@shared/components/MessageModal';
import { formatCurrency } from '@shared/utils/formatters';

const Cuentas = () => {
  const [filtro, setFiltro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ variant: 'success', message: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tiposCuenta, setTiposCuenta] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [cuentahabientes, setCuentahabientes] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Hook personalizado
  const { cuentas, loading, error, createCuenta, updateCuenta, deleteCuenta } = useCuentas();

  // Cargar tipos de cuenta y sucursales
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        console.log('Iniciando carga de opciones...');
        
        const [tiposRes, sucursalesRes, cuentahabientesRes] = await Promise.all([
          tipoCuentaService.getAll(),
          sucursalService.getAll(),
          cuentahabienteService.getAll()
        ]);
        
        console.log('Respuesta tipos de cuenta:', tiposRes);
        console.log('Respuesta sucursales:', sucursalesRes);
        
        // Asegurar que los datos sean arrays
        const tiposData = Array.isArray(tiposRes.data) ? tiposRes.data : [];
        const sucursalesData = Array.isArray(sucursalesRes.data) ? sucursalesRes.data : [];
        const cuentahabientesData = Array.isArray(cuentahabientesRes.data) ? cuentahabientesRes.data : [];
        
        console.log('Tipos de cuenta procesados:', tiposData);
        console.log('Sucursales procesadas:', sucursalesData);
        
        // Log detallado de la primera sucursal para debug
        if (sucursalesData.length > 0) {
          console.log('Primera sucursal detallada:', sucursalesData[0]);
          console.log('TipoSucursal en primera sucursal:', sucursalesData[0].tipoSucursal);
          console.log('Ciudad en primera sucursal:', sucursalesData[0].ciudad);
        }
        
        setTiposCuenta(tiposData);
        setSucursales(sucursalesData);
        setCuentahabientes(cuentahabientesData);
        
        if (tiposData.length === 0) {
          console.warn('No se encontraron tipos de cuenta');
        }
        if (sucursalesData.length === 0) {
          console.warn('No se encontraron sucursales');
        }
      } catch (err) {
        console.error('Error al cargar opciones:', err);
        console.error('Error response:', err.response);
        console.error('Error data:', err.response?.data);
        console.error('Error message:', err.message);
        toast.error(`Error al cargar opciones: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, []);

  // React Hook Form
  const methods = useForm({
    defaultValues: {
      Numero: '',
      IdTipoCuenta: '',
      IdSucursal: '',
      IdCuentahabiente: '',
      Saldo: 0,
      Sobregiro: 0,
      FechaApertura: new Date().toISOString().split('T')[0]
    }
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    const result = editing
      ? await updateCuenta(editing.IdCuenta, data)
      : await createCuenta(data);
    
    if (result.success) {
      setMessageModalContent({
        variant: 'success',
        message: editing ? 'Cuenta actualizada exitosamente' : 'Cuenta creada exitosamente'
      });
      setShowModal(false);
      setShowMessageModal(true);
      setEditing(null);
      reset();
    } else {
      setMessageModalContent({
        variant: 'error',
        message: result.error || (editing ? 'Error al actualizar la cuenta' : 'Error al crear la cuenta')
      });
      setShowMessageModal(true);
    }
  };

  const handleEdit = (cuenta) => {
    setEditing(cuenta);
    // Obtener el primer titular si existe
    const primerTitular = cuenta.titulares && cuenta.titulares.length > 0 
      ? cuenta.titulares[0].IdCuentahabiente 
      : '';
    
    reset({
      Numero: cuenta.Numero || '',
      IdTipoCuenta: cuenta.IdTipoCuenta || '',
      IdSucursal: cuenta.IdSucursal || '',
      IdCuentahabiente: primerTitular,
      Saldo: cuenta.Saldo || 0,
      Sobregiro: cuenta.Sobregiro || 0,
      FechaApertura: cuenta.FechaApertura || new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteCuenta(deletingId);
    setIsDeleting(false);
    setShowConfirmModal(false);

    if (result.success) {
      setMessageModalContent({
        variant: 'success',
        message: 'Cuenta eliminada exitosamente'
      });
      setShowMessageModal(true);
    } else {
      setMessageModalContent({
        variant: 'error',
        message: result.error || 'Error al eliminar la cuenta'
      });
      setShowMessageModal(true);
    }
    setDeletingId(null);
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
        <button 
          className="btn-primary" 
          onClick={() => {
            setEditing(null);
            reset({
              Numero: '',
              IdTipoCuenta: '',
              IdSucursal: '',
              IdCuentahabiente: '',
              Saldo: 0,
              Sobregiro: 0,
              FechaApertura: new Date().toISOString().split('T')[0]
            });
            setShowModal(true);
          }}
        >
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

      <Table
        columns={[
          { 
            key: 'IdCuenta', 
            header: 'ID',
            render: (value, row, index) => index + 1
          },
          { 
            key: 'Numero', 
            header: 'Número',
            render: (value) => <span className="font-semibold">{value}</span>
          },
          { 
            key: 'tipoCuenta', 
            header: 'Tipo',
            render: (value) => (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {value?.TipoCuenta || 'N/A'}
              </span>
            )
          },
          { 
            key: 'sucursal', 
            header: 'Sucursal',
            render: (value) => value?.Sucursal || 'N/A'
          },
          { 
            key: 'Saldo', 
            header: 'Saldo',
            render: (value, row) => (
              <span className={`font-bold ${parseFloat(value) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(value)}
              </span>
            )
          },
          { 
            key: 'Sobregiro', 
            header: 'Límite Sobregiro',
            render: (value) => (
              <span className="text-gray-700">
                {formatCurrency(value || 0)}
              </span>
            )
          },
          { 
            key: 'FechaApertura', 
            header: 'Fecha Apertura',
            render: (value) => new Date(value).toLocaleDateString('es-ES')
          },
          { 
            key: 'titulares', 
            header: 'Titular(es)',
            render: (value) => value?.map(t => t.Nombre).join(', ') || 'Sin titular'
          },
          {
            key: 'actions',
            header: 'Acciones',
            render: (_, row) => (
              <div className="flex gap-2 items-center justify-center">
                <button
                  onClick={() => handleEdit(row)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(row.IdCuenta)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          }
        ]}
        data={cuentasFiltradas}
        emptyMessage="No hay cuentas disponibles"
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
          reset();
        }}
        title={editing ? 'Editar Cuenta' : 'Nueva Cuenta'}
        size="md"
        footer={
          <div className="flex space-x-4 w-full">
            <Button 
              type="button" 
              variant="danger"
              className="flex-1"
              onClick={() => {
                setShowModal(false);
                reset();
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="primary" 
              className="flex-1"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (editing ? 'Actualizando...' : 'Creando...') : (editing ? 'Actualizar Cuenta' : 'Crear Cuenta')}
            </Button>
          </div>
        }
      >
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
              placeholder={loadingOptions ? 'Cargando...' : (tiposCuenta.length === 0 ? 'No hay tipos disponibles' : 'Seleccione un tipo')}
              options={Array.isArray(tiposCuenta) && tiposCuenta.length > 0 ? tiposCuenta.map(tipo => ({
                value: tipo.IdTipoCuenta,
                label: tipo.TipoCuenta || 'Sin nombre'
              })) : []}
              disabled={loadingOptions}
            />

            <FormSelect
              name="IdSucursal"
              label="Sucursal"
              rules={{ required: 'La sucursal es requerida' }}
              placeholder={loadingOptions ? 'Cargando...' : (sucursales.length === 0 ? 'No hay sucursales disponibles' : 'Seleccione una sucursal')}
              options={Array.isArray(sucursales) && sucursales.length > 0 ? sucursales.map(sucursal => {
                // Manejar diferentes posibles nombres de campos (tipoSucursal, tiposucursal, etc.)
                const tipoSucursal = sucursal.tipoSucursal || sucursal.tiposucursal || null;
                const ciudad = sucursal.ciudad || null;
                const nombreTipo = tipoSucursal?.TipoSucursal || tipoSucursal?.tiposucursal || '';
                const nombreCiudad = ciudad?.Ciudad || ciudad?.ciudad || '';
                
                let label = sucursal.Sucursal || sucursal.sucursal || 'Sin nombre';
                if (nombreTipo) {
                  label += ` - ${nombreTipo}`;
                }
                if (nombreCiudad) {
                  label += ` (${nombreCiudad})`;
                }
                
                return {
                  value: sucursal.IdSucursal || sucursal.idsucursal,
                  label: label
                };
              }) : []}
              disabled={loadingOptions}
            />

            <FormSelect
              name="IdCuentahabiente"
              label="Cuentahabiente (Titular)"
              rules={{ required: 'El cuentahabiente titular es requerido' }}
              placeholder={loadingOptions ? 'Cargando...' : (cuentahabientes.length === 0 ? 'No hay cuentahabientes disponibles' : 'Seleccione un cuentahabiente')}
              options={Array.isArray(cuentahabientes) && cuentahabientes.length > 0 ? cuentahabientes.map(ch => ({
                value: ch.IdCuentahabiente,
                label: `${ch.Nombre} - ${ch.tipoDocumento?.Sigla || ch.tipoDocumento?.TipoDocumento || ''} ${ch.Documento}`
              })) : []}
              disabled={loadingOptions}
            />

            <div className="grid grid-cols-2 gap-4">
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
                name="Sobregiro"
                type="number"
                label="Límite de Sobregiro"
                placeholder="0.00"
                rules={{ 
                  min: { value: 0, message: 'El límite de sobregiro no puede ser negativo' }
                }}
                step="0.01"
              />
            </div>

            <FormInput
              name="FechaApertura"
              type="date"
              label="Fecha de Apertura"
              rules={{ required: 'La fecha de apertura es requerida' }}
            />
          </form>
        </FormProvider>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setDeletingId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message="¿Está seguro de que desea eliminar esta cuenta? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={isDeleting}
      />

      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        message={messageModalContent.message}
        variant={messageModalContent.variant}
      />
    </div>
  );
};

export default Cuentas;
