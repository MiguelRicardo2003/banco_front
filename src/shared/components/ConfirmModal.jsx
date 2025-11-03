import PropTypes from 'prop-types';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false
}) => {
  const iconMap = {
    danger: <AlertTriangle className="w-6 h-6 text-red-600" />,
    success: <CheckCircle className="w-6 h-6 text-green-600" />,
    warning: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
    info: <Info className="w-6 h-6 text-blue-600" />
  };

  const buttonVariantMap = {
    danger: 'primary',
    success: 'primary',
    warning: 'primary',
    info: 'primary'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? undefined : onClose}
      title={title}
      size="sm"
      closeOnOverlay={!loading}
      showCloseButton={!loading}
      footer={
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariantMap[variant] || 'primary'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Procesando...' : confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-4 animate-fadeIn">
        <div className="flex-shrink-0 animate-scaleIn" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
          {iconMap[variant]}
        </div>
        <div className="flex-1">
          <p className="text-gray-700 animate-slideIn" style={{ animationDelay: '0.15s', animationFillMode: 'backwards' }}>{message}</p>
        </div>
      </div>
    </Modal>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(['danger', 'success', 'warning', 'info']),
  loading: PropTypes.bool
};

export default ConfirmModal;

