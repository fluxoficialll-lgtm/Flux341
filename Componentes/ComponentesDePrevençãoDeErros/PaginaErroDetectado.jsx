
import React from 'react';

const IconeMicrochip = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00c2ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="14"x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);

// Função para garantir que o valor a ser exibido seja uma string.
const safeToString = (value) => {
  if (typeof value === 'string') return value;
  if (value instanceof Error) return value.message;
  if (value === null || value === undefined) return 'Não disponível';
  try {
    return JSON.stringify(value, null, 2); // Formata o JSON para melhor leitura
  } catch {
    return 'Valor não serializável';
  }
};

export function PaginaErroDetectado({ error, resetErrorBoundary }) {

  const handleRecovery = () => {
    if (resetErrorBoundary) {
      try {
        resetErrorBoundary();
      } catch (e) {
        console.error("Falha ao executar resetErrorBoundary. Forçando reload completo.", e);
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  };
  
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-[#0c0f14] flex flex-col items-center justify-center p-6 text-center font-['Inter']">
       <style>{`
        /* Estilos (sem alterações) */
       `}</style>

      <div className="error-circle animate-pulse">
        <IconeMicrochip />
      </div>

      <h1 className="error-title">Ops! Algo falhou.</h1>

      <p className="error-msg">
        A interface encontrou um erro crítico. Seus dados estão seguros.
      </p>

      {isDev && error && (
        <div className="error-details">
          <pre>
            <strong>{safeToString(error.name)}:</strong> {safeToString(error.message)}
            {error.stack && `

${safeToString(error.stack)}`}
          </pre>
        </div>
      )}

      <div className="mt-8">
        <button className="retry-btn" onClick={handleRecovery}>
          Recuperar Sistema
        </button>
      </div>

      <div className="mt-12 opacity-20 text-[9px] font-black uppercase tracking-[4px]">
        Flux Recovery Engine
      </div>
    </div>
  );
}
