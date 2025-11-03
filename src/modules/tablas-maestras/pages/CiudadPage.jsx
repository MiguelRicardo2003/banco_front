import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useCiudad } from '@modules/tablas-maestras/hooks/useCiudad';
import Table from '@shared/components/Table';
import Loading from '@shared/components/Loading';
import Modal from '@shared/components/Modal';
import ConfirmModal from '@shared/components/ConfirmModal';
import MessageModal from '@shared/components/MessageModal';
import Button from '@shared/components/Button';
import Input from '@shared/components/Input';

const CiudadPage = () => {
  const { ciudades, loading, error, createCiudad, updateCiudad, deleteCiudad } = useCiudad();
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ variant: 'success', message: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ Ciudad: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = editing 
      ? await updateCiudad(editing.IdCiudad, formData)
      : await createCiudad(formData);
    
    if (result.success) {
      setMessageModalContent({
        variant: 'success',
        message: editing ? 'Ciudad actualizada exitosamente' : 'Ciudad creada exitosamente'
      });
      setShowModal(false);
      setShowMessageModal(true);
      setEditing(null);
      setFormData({ Ciudad: '' });
    } else {
      setMessageModalContent({
        variant: 'error',
        message: result.error || 'Error al guardar la ciudad'
      });
      setShowMessageModal(true);
    }
  };

  const handleEdit = (ciudad) => {
    setEditing(ciudad);
    setFormData({ Ciudad: ciudad.Ciudad });
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteCiudad(deletingId);
    setIsDeleting(false);
    setShowConfirmModal(false);
    
    if (result.success) {
      setMessageModalContent({
        variant: 'success',
        message: 'Ciudad eliminada exitosamente'
      });
      setShowMessageModal(true);
    } else {
      setMessageModalContent({
        variant: 'error',
        message: result.error || 'Error al eliminar la ciudad'
      });
      setShowMessageModal(true);
    }
    setDeletingId(null);
  };

  const columns = [
    { 
      key: 'IdCiudad', 
      header: 'ID',
      render: (value, row, index) => index + 1
    },
    { key: 'Ciudad', header: 'Ciudad' },
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
            onClick={() => handleDeleteClick(row.IdCiudad)}
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
        <h1 className="text-3xl font-bold text-bbva-blue">Ciudades</h1>
        <Button onClick={() => {
          setEditing(null);
          setFormData({ Ciudad: '' });
          setShowModal(true);
        }}>
          + Nueva Ciudad
        </Button>
      </div>

      <Table
        columns={columns}
        data={ciudades}
        emptyMessage="No hay ciudades registradas"
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
          setFormData({ Ciudad: '' });
        }}
        title={editing ? 'Editar Ciudad' : 'Nueva Ciudad'}
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditing(null);
                setFormData({ Ciudad: '' });
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
              Ciudad *
            </label>
            <Input
              name="Ciudad"
              type="text"
              value={formData.Ciudad}
              onChange={(e) => setFormData({ Ciudad: e.target.value })}
              placeholder="Nombre de la ciudad"
              required
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
        message="¿Está seguro de que desea eliminar esta ciudad? Esta acción no se puede deshacer."
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

export default CiudadPage;

