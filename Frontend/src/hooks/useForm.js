import { useState, useCallback, useMemo } from 'react';

export const useForm = (initialState = {}, validationSchema = null) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoizar el estado inicial para evitar recreaciones
  const memoizedInitialState = useMemo(() => initialState, [JSON.stringify(initialState)]);

  // Memoizar funciones para evitar recreaciones
  const handleChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Marcar como tocado
    setTouched(prev => ({ ...prev, [name]: true }));
  }, [errors]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validar campo al perder el foco si hay esquema de validación
    if (validationSchema && validationSchema[name]) {
      const fieldError = validationSchema[name](formData[name]);
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  }, [formData, validationSchema]);

  const resetForm = useCallback(() => {
    setFormData(memoizedInitialState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [memoizedInitialState]);

  const setFieldValue = useCallback((name, value) => {
    handleChange(name, value);
  }, [handleChange]);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const validateForm = useCallback(() => {
    if (!validationSchema) return true;
    
    const newErrors = {};
    let isValid = true;
    
    Object.keys(validationSchema).forEach(field => {
      const fieldError = validationSchema[field](formData[field]);
      if (fieldError) {
        newErrors[field] = fieldError;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [formData, validationSchema]);

  const submitForm = useCallback(async (onSubmit) => {
    if (!validateForm()) return false;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  // Memoizar el objeto de retorno para evitar recreaciones innecesarias
  const formActions = useMemo(() => ({
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    resetForm,
    setFieldValue,
    setFieldError,
    validateForm,
    submitForm,
    setFormData
  }), [
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    resetForm,
    setFieldValue,
    setFieldError,
    validateForm,
    submitForm
  ]);

  return formActions;
};
