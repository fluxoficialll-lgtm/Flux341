
import React from 'react';
import { PollOption } from '../../types'; // Apenas o tipo PollOption é necessário

// [CORREÇÃO] A interface foi refatorada para receber props primitivas.
// Isso impede que o objeto 'post' com seu 'timestamp' seja passado, resolvendo o erro.
interface PollPostProps {
    postId: string;
    pollOptions: PollOption[];
    votedOptionIndex?: number;
    onVote: (postId: string, index: number) => void;
}

// Função utilitária para formatar números
const formatNumber = (num: number): string => {
    if (!num) return '0';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
};

export const PollPost: React.FC<PollPostProps> = ({ postId, pollOptions, votedOptionIndex, onVote }) => {
    // A lógica interna permanece a mesma, mas agora usa as props diretas
    if (!pollOptions) return null;

    const totalVotes = pollOptions.reduce((acc, curr) => acc + curr.votes, 0);
    const getPercentage = (votes: number) => {
        if (totalVotes === 0) return 0;
        return Math.round((votes / totalVotes) * 100);
    };

    return (
        <div className="mx-4 mt-2.5 mb-2.5 p-3 bg-[#00c2ff0d] rounded-xl border border-[#00c2ff22]">
            {pollOptions.map((option, idx) => {
                const pct = getPercentage(option.votes);
                const isVoted = votedOptionIndex === idx;
                return (
                    <div 
                        key={idx}
                        onClick={() => onVote(postId, idx)} // Usa o postId recebido via prop
                        className={`relative mb-2 p-3 rounded-lg cursor-pointer overflow-hidden font-medium transition-colors ${isVoted ? 'bg-[#00c2ff] text-black font-bold' : 'bg-[#1e2531] hover:bg-[#28303f]'}`}
                    >
                        <div 
                            className="absolute top-0 left-0 h-full bg-[#00c2ff] opacity-30 z-0 transition-all duration-500" 
                            style={{ width: `${pct}%` }}
                        ></div>
                        <div className="relative z-10 flex justify-between items-center text-sm">
                            <span>{option.text}</span>
                            <span>{pct}%</span>
                        </div>
                    </div>
                );
            })}
            <div className="text-right text-xs text-gray-500 mt-1">
                {formatNumber(totalVotes)} votos
            </div>
        </div>
    );
};
