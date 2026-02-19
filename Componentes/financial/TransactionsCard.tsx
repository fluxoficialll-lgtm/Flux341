
import React from 'react';

interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
}

// Dados mockados para o design inicial
const mockTransactions: Transaction[] = [
    { id: '1', date: '2024-07-28', description: 'Venda de produto X', amount: 150.00, status: 'completed' },
    { id: '2', date: '2024-07-27', description: 'Assinatura de plano Y', amount: 29.90, status: 'completed' },
    { id: '3', date: '2024-07-26', description: 'Venda de produto Z', amount: 75.50, status: 'pending' },
    { id: '4', date: '2024-07-25', description: 'Reembolso de compra', amount: -50.00, status: 'completed' },
];

export const TransactionsCard: React.FC = () => {
    // Lógica futura para buscar e filtrar transações reais aqui

    return (
        <div className="form-card spaced-card"> 
            <div className="card-header">
                <h3>Transações</h3>
                <div className="header-actions">
                    <button className="action-button">Exportar <i className="fa-solid fa-download"></i></button>
                    <button className="filter-button">Filtrar <i className="fa-solid fa-filter"></i></button>
                </div>
            </div>
            <div className="transactions-list">
                {mockTransactions.map(tx => (
                    <div key={tx.id} className="transaction-item">
                        <div className="transaction-details">
                            <p className="description">{tx.description}</p>
                            <p className="date">{tx.date}</p>
                        </div>
                        <div className={`transaction-amount ${tx.amount < 0 ? 'negative' : 'positive'}`}>
                            {tx.amount.toFixed(2).replace('.', ',')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
