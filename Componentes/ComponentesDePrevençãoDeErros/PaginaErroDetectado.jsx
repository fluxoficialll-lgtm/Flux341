
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

export function PaginaErroDetectado({ error, resetErrorBoundary }) {

  const handleRecovery = () => {
    // A função resetErrorBoundary é a preferida, pois tenta uma recuperação "suave".
    if (resetErrorBoundary) {
      try {
        resetErrorBoundary();
        // Se a função for chamada mas não recarregar, o fallback abaixo não será acionado.
        // Para garantir, poderíamos adicionar um timeout para forçar o reload se nada acontecer, 
        // mas a solução mais simples é o utilizador poder clicar novamente.
      } catch (e) {
        console.error("Falha ao executar resetErrorBoundary. Forçando reload completo.", e);
        window.location.reload();
      }
    } else {
      // Fallback robusto: se a função não for fornecida, recarrega a página.
      window.location.reload();
    }
  };
  
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-[#0c0f14] flex flex-col items-center justify-center p-6 text-center font-['Inter']">
       <style>{`
        .error-circle {
          width: 80px; height: 80px;
          background: rgba(0, 194, 255, 0.1);
          border: 2px solid #00c2ff;
          border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          color: #00c2ff; font-size: 32px; margin-bottom: 24px;
          box-shadow: 0 0 30px rgba(0, 194, 255, 0.2);
        }

        .error-title {
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
        }

        .error-msg {
          font-size: 14px;
          color: #999;
          max-width: 320px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .error-details {
          margin-top: 24px;
          padding: 16px;
          background: rgba(255, 82, 82, 0.05);
          border: 1px solid rgba(255, 82, 82, 0.1);
          border-radius: 12px;
          text-align: left;
          font-size: 12px;
          max-width: 700px;
          width: 100%;
          max-height: 250px;
          overflow-y: auto;
          word-wrap: break-word;
        }

        .error-details pre {
          white-space: pre-wrap;
          color: #ff5252;
          font-family: 'SF Mono', 'Menlo', 'monospace';
        }

        .retry-btn {
          background: #00c2ff;
          color: #000;
          padding: 16px 40px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 10px 20px rgba(0, 194, 255, 0.2);
        }

        .retry-btn:active {
          transform: scale(0.98);
        }
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
            <strong>{error.name}:</strong> {error.message}
            {error.stack && `

${error.stack}`}
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
