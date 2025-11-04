import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useTipoMovimiento } from '@modules/tablas-maestras/hooks/useTipoMovimiento';
import Table from '@shared/components/Table';
import Loading from '@shared/components/Loading';
import Modal from '@shared/components/Modal';
import ConfirmModal from '@shared/components/ConfirmModal';
import MessageModal from '@shared/components/MessageModal';
import Button from '@shared/components/Button';
import Input from '@shared/components/Input';

const TipoMovimientoPage = () => {
  const { tipos, loading, error, createTipo, updateTipo, deleteTipo } = useTipoMovimiento();
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ variant: 'success', message: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ TipoMovimiento: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = editing 
      ? await updateTipo(editing.IdTipoMovimiento, formData)
      : await createTipo(formData);
    
    if (result.success) {
      setMessageModalContent({
        variant: 'success',
        message: editing ? 'Tipo de movimiento actualizado exitosamente' : 'Tipo de movimiento creado exitosamente'
      });
      setShowModal(false);
      setShowMessageModal(true);
      setEditing(null);
      setFormData({ TipoMovimiento: '' });
    } else {
      setMessageModalContent({
        variant: 'error',
        message: result.error || 'Error al guardar el tipo de movimiento'
      });
      setShowMessageModal(true);
    }
  };

  const handleEdit = (tipo) => {
    setEditing(tipo);
    setFormData({ TipoMovimiento: tipo.TipoMovimiento });
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteTipo(deletingId);
    setIsDeleting(false);
    setShowConfirmModal(false);
    
    if (result.success) {
      setMessageModalContent({
        variant: 'success',
        message: 'Tipo de movimiento eliminado exitosamente'
      });
      setShowMessageModal(true);
    } else {
      setMessageModalContent({
        variant: 'error',
        message: result.error || 'Error al eliminar el tipo de movimiento'
      });
      setShowMessageModal(true);
    }
    setDeletingId(null);
  };

  const columns = [
    { 
      key: 'IdTipoMovimiento', 
      header: 'ID',
      render: (value, row, index) => index + 1
    },
    { key: 'TipoMovimiento', header: 'Tipo Movimiento' },
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
            onClick={() => handleDeleteClick(row.IdTipoMovimiento)}
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
        <h1 className="text-3xl font-bold text-bbva-blue">Tipos de Movimiento</h1>
        <Button onClick={() => {
          setEditing(null);
          setFormData({ TipoMovimiento: '' });
          setShowModal(true);
        }}>
          + Nuevo
        </Button>
      </div>

      <Table columns={columns} data={tipos} emptyMessage="No hay registros" />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
          setFormData({ TipoMovimiento: '' });
        }}
        title={editing ? 'Editar' : 'Nuevo'}
        footer={
          <div className="flex gap-3">
            <Button variant="danger" onClick={() => {
              setShowModal(false);
              setEditing(null);
              setFormData({ TipoMovimiento: '' });
            }}>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Movimiento *</label>
            <Input
              name="TipoMovimiento"
              type="text"
              value={formData.TipoMovimiento}
              onChange={(e) => setFormData({ TipoMovimiento: e.target.value })}
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
        message="¿Está seguro de que desea eliminar este tipo de movimiento? Esta acción no se puede deshacer."
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

export default TipoMovimientoPage;

