
import React from 'react';

interface CashFlowData {
    month: string;
    inflow: number;
    outflow: number;
}

// Dados mockados para o design inicial
const mockData: CashFlowData[] = [
    { month: 'Jan', inflow: 4000, outflow: 2400 },
    { month: 'Fev', inflow: 3000, outflow: 1398 },
    { month: 'Mar', inflow: 2000, outflow: 9800 },
    { month: 'Abr', inflow: 2780, outflow: 3908 },
    { month: 'Mai', inflow: 1890, outflow: 4800 },
    { month: 'Jun', inflow: 2390, outflow: 3800 },
];

export const CashFlowCard: React.FC = () => {
    // Lógica futura para buscar e processar dados reais aqui

    return (
        <div className="form-card spaced-card"> 
            <div className="card-header">
                <h3>Fluxo de Caixa</h3>
                <div className="filter-tabs">
                    <button className="tab-button active">6 meses</button>
                    <button className="tab-button">1 ano</button>
                </div>
            </div>
            <div className="chart-placeholder">
                {/* Espaço reservado para um futuro componente de gráfico sofisticado */}
                <p>Gráfico de Fluxo de Caixa aparecerá aqui.</p>
            </div>
        </div>
    );
};
