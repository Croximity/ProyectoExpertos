import { useState, useCallback, useMemo } from 'react';

export const useToast = () => {
  // Memoizar el estado inicial para evitar recreaciones
  const initialState = useMemo(() => ({
    show: false,
    message: '',
    type: 'success'
  }), []);

  const [toast, setToast] = useState(initialState);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({
      show: true,
      message,
      type,
      duration
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  const showSuccess = useCallback((message) => {
    showToast(message, 'success');
  }, [showToast]);

  const showError = useCallback((message) => {
    showToast(message, 'danger');
  }, [showToast]);

  const showWarning = useCallback((message) => {
    showToast(message, 'warning');
  }, [showToast]);

  const showInfo = useCallback((message) => {
    showToast(message, 'info');
  }, [showToast]);

  // Memoizar el objeto de retorno para evitar recreaciones innecesarias
  const toastActions = useMemo(() => ({
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }), [toast, showToast, hideToast, showSuccess, showError, showWarning, showInfo]);

  return toastActions;
};
