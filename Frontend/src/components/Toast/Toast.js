import React from 'react';
import { Toast as ToastStrap, ToastHeader, ToastBody } from 'reactstrap';

const Toast = ({ show, message, type, onClose }) => {
  if (!show) return null;

  // Asegurar que el mensaje sea una cadena de texto
  const displayMessage = typeof message === 'string' ? message : 
                        typeof message === 'object' ? JSON.stringify(message) : 
                        'Mensaje no válido';

  return (
    <div className="position-fixed" style={{ top: '20px', right: '20px', zIndex: 9999 }}>
      <ToastStrap isOpen={show} className={`bg-${type} text-white`}>
        <ToastHeader className={`bg-${type} text-white`} toggle={onClose}>
          {type === 'success' ? '✅ Éxito' : type === 'error' ? '❌ Error' : 'ℹ️ Información'}
        </ToastHeader>
        <ToastBody>
          {displayMessage}
        </ToastBody>
      </ToastStrap>
    </div>
  );
};

export default Toast;
