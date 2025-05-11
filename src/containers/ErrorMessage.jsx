import React from 'react';
const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <i className="bi bi-exclamation-triangle"></i>
    <p>{message}</p>
    <button onClick={() => window.location.reload()}>
      Reintentar
    </button>
  </div>
);

export default ErrorMessage;