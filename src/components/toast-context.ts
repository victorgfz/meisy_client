import { createContext } from 'react';
import type { ToastVariant } from './toast';

export type ShowToast = (
  message: string,
  variant?: ToastVariant,
  duration?: number,
) => void;

export const ToastContext = createContext<ShowToast | null>(null);
