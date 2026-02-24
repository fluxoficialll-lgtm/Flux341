
import React from 'react';

// [CORREÇÃO] A interface foi refatorada para receber props primitivas.
// Isso evita que o objeto 'post' inteiro, que contém o 'timestamp' (um objeto Date), 
// seja passado para o componente, resolvendo o erro "Cannot convert object to primitive value".
interface PostActionsProps {
    likes: number;
    comments: number;
    views: number;
    liked: boolean;
    onLike: () => void;
    onCommentClick: () => void;
    onShare: () => void;
}

// Função utilitária para formatar números grandes (k, M)
const formatNumber = (num: number): string => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
};

export const PostActions: React.FC<PostActionsProps> = ({ 
    likes, 
    comments, 
    views, 
    liked, 
    onLike, 
    onCommentClick, 
    onShare 
}) => {
    return (
        <div className="grid grid-cols-4 px-2 py-3 mt-1 border-t border-white/5 gap-1">
            <button 
                onClick={onLike}
                className={`flex items-center justify-center gap-2 transition-all ${liked ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-[#00c2ff]'}`}
            >
                <i className={`${liked ? 'fa-solid' : 'fa-regular'} fa-heart text-xl`}></i>
                <span className="text-xs font-semibold">{formatNumber(likes)}</span>
            </button>
            
            <button 
                onClick={onCommentClick}
                className="flex items-center justify-center gap-2 text-gray-400 hover:text-[#00c2ff] transition-all"
            >
                <i className="fa-regular fa-comment text-xl"></i>
                <span className="text-xs font-semibold">{formatNumber(comments)}</span>
            </button>

            <button 
                onClick={onShare}
                className="flex items-center justify-center text-gray-400 hover:text-[#00c2ff] transition-all"
            >
                <i className="fa-regular fa-paper-plane text-xl"></i>
            </button>

            <div className="flex items-center justify-center gap-2 text-gray-400 transition-all cursor-default opacity-70">
                <i className="fa-solid fa-eye text-lg"></i>
                <span className="text-xs font-semibold">{formatNumber(views)}</span>
            </div>
        </div>
    );
};
