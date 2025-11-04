import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useSucursal } from '@modules/tablas-maestras/hooks/useSucursal';
import { ciudadService } from '@services/ciudadService';
import { tipoSucursalService } from '@services/tipoSucursalService';
import Table from '@shared/components/Table';
import Loading from '@shared/components/Loading';
import Modal from '@shared/components/Modal';
import ConfirmModal from '@shared/components/ConfirmModal';
import MessageModal from '@shared/components/MessageModal';
import Button from '@shared/components/Button';
import Input from '@shared/components/Input';
import FormSelect from '@shared/components/FormSelect';

const SucursalPage = () => {
  const { sucursales, loading, error, createSucursal, updateSucursal, deleteSucursal } = useSucursal();
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ variant: 'success', message: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    Sucursal: '',
    IdCiudad: '',
    IdTipoSucursal: '',
    Direccion: '',
    Telefono: '',
    Horario: ''
  });
  const [ciudades, setCiudades] = useState([]);
  const [tiposSucursal, setTiposSucursal] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        const [ciudadesRes, tiposRes] = await Promise.all([
          ciudadService.getAll(),
          tipoSucursalService.getAll()
        ]);
        setCiudades(Array.isArray(ciudadesRes.data) ? ciudadesRes.data : []);
        setTiposSucursal(Array.isArray(tiposRes.data) ? tiposRes.data : []);
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
    const result = editing 
      ? await updateSucursal(editing.IdSucursal, formData)
      : await createSucursal(formData);
    
    if (result.success) {
      setMessageModalContent({
        variant: 'success',
        message: editing ? 'Sucursal actualizada exitosamente' : 'Sucursal creada exitosamente'
      });
      setShowModal(false);
      setShowMessageModal(true);
      setEditing(null);
      setFormData({
        Sucursal: '',
        IdCiudad: '',
        IdTipoSucursal: '',
        Direccion: '',
        Telefono: '',
        Horario: ''
      });
    } else {
      setMessageModalContent({
        variant: 'error',
        message: result.error || 'Error al guardar la sucursal'
      });
      setShowMessageModal(true);
    }
  };

  const handleEdit = (sucursal) => {
    setEditing(sucursal);
    setFormData({
      Sucursal: sucursal.Sucursal || '',
      IdCiudad: sucursal.IdCiudad || '',
      IdTipoSucursal: sucursal.IdTipoSucursal || '',
      Direccion: sucursal.Direccion || '',
      Telefono: sucursal.Telefono || '',
      Horario: sucursal.Horario || ''
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteSucursal(deletingId);
    setIsDeleting(false);
    setShowConfirmModal(false);
    
    if (result.success) {
      setMessageModalContent({
        variant: 'success',
        message: 'Sucursal eliminada exitosamente'
      });
      setShowMessageModal(true);
    } else {
      setMessageModalContent({
        variant: 'error',
        message: result.error || 'Error al eliminar la sucursal'
      });
      setShowMessageModal(true);
    }
    setDeletingId(null);
  };

  const columns = [
    { 
      key: 'IdSucursal', 
      header: 'ID',
      render: (value, row, index) => index + 1
    },
    { key: 'Sucursal', header: 'Sucursal' },
    {
      key: 'ciudad',
      header: 'Ciudad',
      render: (value) => value?.Ciudad || 'N/A'
    },
    {
      key: 'tipoSucursal',
      header: 'Tipo',
      render: (value) => value?.TipoSucursal || 'N/A'
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
            onClick={() => handleDeleteClick(row.IdSucursal)}
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
        <h1 className="text-3xl font-bold text-bbva-blue">Sucursales</h1>
        <Button onClick={() => {
          setEditing(null);
          setFormData({
            Sucursal: '',
            IdCiudad: '',
            IdTipoSucursal: '',
            Direccion: '',
            Telefono: '',
            Horario: ''
          });
          setShowModal(true);
        }}>
          + Nueva Sucursal
        </Button>
      </div>

      <Table
        columns={columns}
        data={sucursales}
        emptyMessage="No hay sucursales registradas"
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
          setFormData({
            Sucursal: '',
            IdCiudad: '',
            IdTipoSucursal: '',
            Direccion: '',
            Telefono: '',
            Horario: ''
          });
        }}
        title={editing ? 'Editar Sucursal' : 'Nueva Sucursal'}
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={() => {
                setShowModal(false);
                setEditing(null);
                setFormData({
                  Sucursal: '',
                  IdCiudad: '',
                  IdTipoSucursal: '',
                  Direccion: '',
                  Telefono: '',
                  Horario: ''
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
              Nombre de la Sucursal *
            </label>
            <Input
              name="Sucursal"
              type="text"
              value={formData.Sucursal}
              onChange={(e) => setFormData({ ...formData, Sucursal: e.target.value })}
              placeholder="Nombre de la sucursal"
              required
            />
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
              Tipo de Sucursal *
            </label>
            <select
              name="IdTipoSucursal"
              value={formData.IdTipoSucursal}
              onChange={(e) => setFormData({ ...formData, IdTipoSucursal: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bbva-blue"
              required
              disabled={loadingOptions}
            >
              <option value="">{loadingOptions ? 'Cargando...' : 'Seleccione un tipo'}</option>
              {tiposSucursal.map(tipo => (
                <option key={tipo.IdTipoSucursal} value={tipo.IdTipoSucursal}>
                  {tipo.TipoSucursal}
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
              placeholder="Dirección de la sucursal"
            />
          </div>

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
              Horario
            </label>
            <Input
              name="Horario"
              type="text"
              value={formData.Horario}
              onChange={(e) => setFormData({ ...formData, Horario: e.target.value })}
              placeholder="Ej: Lunes a Viernes 8am - 5pm"
            />
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
        message="¿Está seguro de que desea eliminar esta sucursal? Esta acción no se puede deshacer."
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

export default SucursalPage;

