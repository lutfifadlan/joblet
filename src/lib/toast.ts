import { toast } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  id?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const defaultDuration = 3000;

/**
 * Standardized toast notification utility
 */
export const showToast = (
  message: string,
  type: ToastType = 'info',
  options: ToastOptions = {}
) => {
  const { duration = defaultDuration, id, action } = options;
  
  switch (type) {
    case 'success':
      return toast.success(message, { duration, id, action });
    case 'error':
      return toast.error(message, { duration, id, action });
    case 'warning':
      return toast.warning(message, { duration, id, action });
    case 'info':
    default:
      return toast.info(message, { duration, id, action });
  }
};

// Convenience methods
export const showSuccessToast = (message: string, options?: ToastOptions) => 
  showToast(message, 'success', options);

export const showErrorToast = (message: string, options?: ToastOptions) => 
  showToast(message, 'error', options);

export const showWarningToast = (message: string, options?: ToastOptions) => 
  showToast(message, 'warning', options);

export const showInfoToast = (message: string, options?: ToastOptions) => 
  showToast(message, 'info', options);
