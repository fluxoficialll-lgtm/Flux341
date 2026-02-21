
import React from 'react';
import { Link } from 'react-router-dom';

interface LoginInitialCardProps {
    onSelectEmail: () => void;
    googleButtonSlot: React.ReactNode; // Alterado de googleButtonId para googleButtonSlot
    loading: boolean;
    googleProcessing: boolean;
}

export const LoginInitialCard: React.FC<LoginInitialCardProps> = ({ 
    onSelectEmail, 
    googleButtonSlot, // Usando a nova prop
    loading, 
    googleProcessing 
}) => {
    return (
        <div className="w-full flex flex-col items-center animate-fade-in">
            <div className="mb-8 w-[80px] h-[80px] bg-white/5 rounded-2xl flex items-center justify-center relative border border-white/10 shadow-[0_0_30px_rgba(0,194,255,0.2)]">
                <div className="absolute w-[50px] h-[28px] rounded-[50%] border-[4px] border-[#00c2ff] rotate-[25deg]"></div>
                <div className="absolute w-[50px] h-[28px] rounded-[50%] border-[4px] border-[#00c2ff] -rotate-[25deg]"></div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-3 text-white">Flux</h1>
            <p className="text-gray-400 text-sm text-center mb-8 leading-relaxed">
                Sua plataforma de conexão e conteúdo.
            </p>

            <div className="w-full space-y-4">
                {/* O novo Google Button é renderizado diretamente aqui */}
                {googleButtonSlot}

                <button 
                    onClick={onSelectEmail}
                    className="w-full py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                >
                    <i className="fa-solid fa-envelope"></i>
                    Entrar com E-mail e Senha
                </button>
            </div>

            <div className="mt-8 flex flex-col gap-3 items-center text-sm w-full">
                <div className="w-full h-[1px] bg-white/5"></div>
                <div className="flex gap-6 mt-2">
                    <Link to="/register" className="text-[#00c2ff] hover:underline font-semibold">Criar conta</Link>
                    <span className="text-gray-700">|</span>
                    <Link to="/forgot-password" title="Esqueci a senha" className="text-gray-400 hover:text-white transition-colors">Esqueci a senha</Link>
                </div>
            </div>
        </div>
    );
};
