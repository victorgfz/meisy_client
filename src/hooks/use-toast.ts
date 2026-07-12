import { useContext } from 'react';
import { ToastContext } from '../components/toast-context';

export function useToast() {
  const showToast = useContext(ToastContext);

  if (!showToast) {
    throw new Error('useToast deve ser usado dentro de ToastProvider.');
  }

  return showToast;
}
