import React, { Component, ErrorInfo, ReactNode } from 'react';
import { rastreadorDeEventos as eventTracker } from '../../ServiçosFrontend/ServiçoDeTelemetria/RastreadorDeEventos.js';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Global Error Boundary Aprimorado
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined
  };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): State {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log aprimorado para a consola
    console.error("🔴 [CRITICAL UI ERROR]:", error);
    if (errorInfo.componentStack) {
      console.error("Stack do Componente React:", errorInfo.componentStack);
    }
    // Envia o erro para um serviço de telemetria
    eventTracker.trackCriticalError(error, 'GLOBAL_BOUNDARY_CATCH', { 
      componentStack: errorInfo.componentStack 
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.hash = '/';
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Em ambiente de produção, podemos querer mostrar menos detalhes.
      // Vite define `process.env.NODE_ENV` para 'development' ou 'production'.
      const isDev = process.env.NODE_ENV === 'development';

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
            .error-title { font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 8px; }
            .error-msg { font-size: 14px; color: #999; max-width: 320px; margin: 0 auto; line-height: 1.6; }
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
              background: #00c2ff; color: #000;
              padding: 16px 40px; border-radius: 16px;
              font-weight: 800; font-size: 14px; text-transform: uppercase;
              letter-spacing: 1px; border: none; cursor: pointer;
              transition: all 0.2s ease;
              box-shadow: 0 10px 20px rgba(0, 194, 255, 0.2);
            }
            .retry-btn:active { transform: scale(0.98); }
          `}</style>

          <div className="error-circle animate-pulse">
            <i className="fa-solid fa-microchip"></i>
          </div>
          
          <h1 className="error-title">Ops! Algo falhou.</h1>
          <p className="error-msg">
            A interface encontrou um erro crítico. Seus dados estão seguros.
          </p>

          {/* NOVO: Bloco para exibir detalhes do erro em modo de desenvolvimento */}
          {isDev && this.state.error && (
            <div className="error-details">
              <pre>
                <strong>{this.state.error.name}:</strong> {this.state.error.message}
                {this.state.error.stack && `\n\n${this.state.error.stack}`}
              </pre>
            </div>
          )}
          
          <div className="mt-8">
            <button className="retry-btn" onClick={this.handleReset}>
              Recuperar Sistema
            </button>
          </div>

          <div className="mt-12 opacity-20 text-[9px] font-black uppercase tracking-[4px]">
            Flux Recovery Engine
          </div>
        </div>
      );
    }

    return this.props.children || null;
  }
}
