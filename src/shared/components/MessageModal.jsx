import PropTypes from 'prop-types';
import Modal from './Modal';
import Button from './Button';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

const MessageModal = ({
  isOpen,
  onClose,
  title,
  message,
  variant = 'success',
  buttonText = 'Aceptar'
}) => {
  const iconMap = {
    success: <CheckCircle className="w-6 h-6 text-green-600" />,
    error: <XCircle className="w-6 h-6 text-red-600" />,
    warning: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
    info: <Info className="w-6 h-6 text-blue-600" />
  };

  const titleMap = {
    success: 'Éxito',
    error: 'Error',
    warning: 'Advertencia',
    info: 'Información'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || titleMap[variant]}
      size="sm"
      footer={
        <Button variant="primary" onClick={onClose}>
          {buttonText}
        </Button>
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

MessageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  buttonText: PropTypes.string
};

export default MessageModal;

