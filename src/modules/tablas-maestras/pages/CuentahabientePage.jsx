import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useCuentahabiente } from '@modules/tablas-maestras/hooks/useCuentahabiente';
import { ciudadService } from '../services/ciudad.service';
import { tipoDocumentoService } from '../services/tipoDocumento.service';
import Table from '@shared/components/Table';
import Loading from '@shared/components/Loading';
import Modal from '@shared/components/Modal';
import ConfirmModal from '@shared/components/ConfirmModal';
import MessageModal from '@shared/components/MessageModal';
import Button from '@shared/components/Button';
import Input from '@shared/components/Input';

const CuentahabientePage = () => {
  const { cuentahabientes, loading, error, createCuentahabiente, updateCuentahabiente, deleteCuentahabiente } = useCuentahabiente();
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ variant: 'success', message: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    Nombre: '',
    IdTipoDocumento: '',
    Documento: '',
    Direccion: '',
    Telefono: '',
    IdCiudad: '',
    Clave: ''
  });
  const [ciudades, setCiudades] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        const [ciudadesRes, tiposRes] = await Promise.all([
          ciudadService.getAll(),
          tipoDocumentoService.getAll()
        ]);
        setCiudades(Array.isArray(ciudadesRes.data) ? ciudadesRes.data : []);
        setTiposDocumento(Array.isArray(tiposRes.data) ? tiposRes.data : []);
      } catch (err) {
        console.error('Error al cargar opciones:', err);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Preparar los datos a enviar
    const datosEnviar = { ...formData };
    
    // Si estamos editando y la clave está vacía, no enviarla (no se actualiza)
    if (editing && (!datosEnviar.Clave || datosEnviar.Clave.trim() === '')) {
      delete datosEnviar.Clave;
    }
    
    const result = editing 
      ? await updateCuentahabiente(editing.IdCuentahabiente, datosEnviar)
      : await createCuentahabiente(datosEnviar);
    
    if (result.success) {
      setMessageModalContent({
        variant: 'success',
        message: editing ? 'Cuentahabiente actualizado exitosamente' : 'Cuentahabiente creado exitosamente'
      });
      setShowModal(false);
      setShowMessageModal(true);
      setEditing(null);
      setFormData({
        Nombre: '',
        IdTipoDocumento: '',
        Documento: '',
        Direccion: '',
        Telefono: '',
        IdCiudad: '',
        Clave: ''
      });
    } else {
      setMessageModalContent({
        variant: 'error',
        message: result.error || 'Error al guardar el cuentahabiente'
      });
      setShowMessageModal(true);
    }
  };

  const handleEdit = (cuentahabiente) => {
    setEditing(cuentahabiente);
    setFormData({
      Nombre: cuentahabiente.Nombre || '',
      IdTipoDocumento: cuentahabiente.IdTipoDocumento || '',
      Documento: cuentahabiente.Documento || '',
      Direccion: cuentahabiente.Direccion || '',
      Telefono: cuentahabiente.Telefono || '',
      IdCiudad: cuentahabiente.IdCiudad || '',
      Clave: cuentahabiente.Clave || ''
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteCuentahabiente(deletingId);
    setIsDeleting(false);
    setShowConfirmModal(false);
    
    if (result.success) {
      setMessageModalContent({
        variant: 'success',
        message: 'Cuentahabiente eliminado exitosamente'
      });
      setShowMessageModal(true);
    } else {
      setMessageModalContent({
        variant: 'error',
        message: result.error || 'Error al eliminar el cuentahabiente'
      });
      setShowMessageModal(true);
    }
    setDeletingId(null);
  };

  const columns = [
    { 
      key: 'IdCuentahabiente', 
      header: 'ID',
      render: (value, row, index) => index + 1
    },
    { key: 'Nombre', header: 'Nombre' },
    {
      key: 'tipoDocumento',
      header: 'Tipo Doc.',
      render: (value) => value?.Sigla || value?.TipoDocumento || 'N/A'
    },
    { key: 'Documento', header: 'Documento' },
    {
      key: 'ciudad',
      header: 'Ciudad',
      render: (value) => value?.Ciudad || 'N/A'
    },
    { key: 'Direccion', header: 'Dirección' },
    { key: 'Telefono', header: 'Teléfono' },
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
            onClick={() => handleDeleteClick(row.IdCuentahabiente)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-bbva-blue">Cuentahabientes</h1>
        <Button onClick={() => {
          setEditing(null);
          setFormData({
            Nombre: '',
            IdTipoDocumento: '',
            Documento: '',
            Direccion: '',
            Telefono: '',
            IdCiudad: '',
            Clave: ''
          });
          setShowModal(true);
        }}>
          + Nuevo Cuentahabiente
        </Button>
      </div>

      <Table
        columns={columns}
        data={cuentahabientes}
        emptyMessage="No hay cuentahabientes registrados"
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
          setFormData({
            Nombre: '',
            IdTipoDocumento: '',
            Documento: '',
            Direccion: '',
            Telefono: '',
            IdCiudad: '',
            Clave: ''
          });
        }}
        title={editing ? 'Editar Cuentahabiente' : 'Nuevo Cuentahabiente'}
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={() => {
                setShowModal(false);
                setEditing(null);
                setFormData({
                  Nombre: '',
                  IdTipoDocumento: '',
                  Documento: '',
                  Direccion: '',
                  Telefono: '',
                  IdCiudad: '',
                  Clave: ''
                });
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editing ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo *
            </label>
            <Input
              name="Nombre"
              type="text"
              value={formData.Nombre}
              onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
              placeholder="Nombre completo del cuentahabiente"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Documento *
              </label>
              <select
                name="IdTipoDocumento"
                value={formData.IdTipoDocumento}
                onChange={(e) => setFormData({ ...formData, IdTipoDocumento: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bbva-blue"
                required
                disabled={loadingOptions}
              >
                <option value="">{loadingOptions ? 'Cargando...' : 'Seleccione un tipo'}</option>
                {tiposDocumento.map(tipo => (
                  <option key={tipo.IdTipoDocumento} value={tipo.IdTipoDocumento}>
                    {tipo.TipoDocumento} {tipo.Sigla ? `(${tipo.Sigla})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Documento *
              </label>
              <Input
                name="Documento"
                type="text"
                value={formData.Documento}
                onChange={(e) => setFormData({ ...formData, Documento: e.target.value })}
                placeholder="Número de documento"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad *
            </label>
            <select
              name="IdCiudad"
              value={formData.IdCiudad}
              onChange={(e) => setFormData({ ...formData, IdCiudad: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bbva-blue"
              required
              disabled={loadingOptions}
            >
              <option value="">{loadingOptions ? 'Cargando...' : 'Seleccione una ciudad'}</option>
              {ciudades.map(ciudad => (
                <option key={ciudad.IdCiudad} value={ciudad.IdCiudad}>
                  {ciudad.Ciudad}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <Input
              name="Direccion"
              type="text"
              value={formData.Direccion}
              onChange={(e) => setFormData({ ...formData, Direccion: e.target.value })}
              placeholder="Dirección de residencia"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <Input
                name="Telefono"
                type="text"
                value={formData.Telefono}
                onChange={(e) => setFormData({ ...formData, Telefono: e.target.value })}
                placeholder="Teléfono de contacto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clave de Acceso {!editing && '*'}
              </label>
              <Input
                name="Clave"
                type="password"
                value={formData.Clave}
                onChange={(e) => setFormData({ ...formData, Clave: e.target.value })}
                placeholder={editing ? "Dejar vacío para no cambiar" : "Clave de acceso"}
                required={!editing}
              />
              {editing && (
                <p className="text-xs text-gray-500 mt-1">
                  Dejar vacío para mantener la clave actual
                </p>
              )}
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setDeletingId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message="¿Está seguro de que desea eliminar este cuentahabiente? Esta acción no se puede deshacer."
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

export default CuentahabientePage;

