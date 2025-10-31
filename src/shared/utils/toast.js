import toast from 'react-hot-toast';

// Notificaciones personalizadas para el proyecto

export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10B981',
      color: '#fff',
    },
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#fff',
    },
  });
};

export const showInfoToast = (message) => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#004481',
      color: '#fff',
    },
  });
};

export const showLoadingToast = (message) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Toast para confirmaciones con promise
export const showPromiseToast = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Procesando...',
      success: messages.success || 'Operación exitosa',
      error: messages.error || 'Error en la operación',
    },
    {
      position: 'top-right',
    }
  );
};
