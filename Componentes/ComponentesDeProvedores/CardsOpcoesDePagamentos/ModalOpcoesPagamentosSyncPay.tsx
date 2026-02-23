
import React, { useState, useEffect, useRef } from 'react';
import { syncPayService } from '../../../ServiçosFrontend/ServiçosDeProvedores/syncPayService';
import { authService } from '../../../ServiçosFrontend/ServiçoDeAutenticação/authService.js';
import { currencyService } from '../../../ServiçosFrontend/ServiçoDeMoeda/currencyService.js';
import { Group, User } from '../../../types';
import { SyncPayPixView } from '../CardsMétodosDePagamentos/SyncPayPixView';
import { SyncPayBoletoView } from '../CardsMétodosDePagamentos/SyncPayBoletoView';

interface ModalOpcoesPagamentosSyncPayProps {
    group: Group;
    onSuccess: () => void;
    onError: (msg: string) => void;
    onTransactionId: (id: string) => void;
}

type SyncPayView = 'selection' | 'pix' | 'boleto';

export const ModalOpcoesPagamentosSyncPay: React.FC<ModalOpcoesPagamentosSyncPayProps> = ({ group, onSuccess, onError, onTransactionId }) => {
    const [currentView, setCurrentView] = useState<SyncPayView>('selection');
    const [pixCode, setPixCode] = useState('');
    const [pixImage, setPixImage] = useState<string | undefined>(undefined);
    const [boletoUrl, setBoletoUrl] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const pollingInterval = useRef<any>(null);

    useEffect(() => {
        return () => { if (pollingInterval.current) clearInterval(pollingInterval.current); };
    }, []);

    const generatePayment = async (selectedMethod: SyncPayView) => {
        if (selectedMethod === 'selection') return;
        
        setLoading(true);
        
        const user = authService.getCurrentUser();
        const guestEmail = localStorage.getItem('guest_email_capture');
        if (!user && !guestEmail) { 
            onError("E-mail não identificado. Por favor, recarregue a página."); 
            setLoading(false);
            return; 
        }
        
        const email = user?.email || guestEmail!;

        try {
            const baseCurrency = group.currency || 'BRL';
            const basePrice = parseFloat(group.price || '0');
            
            let finalBrlAmount = basePrice;
            let conversionResult = null;

            if (baseCurrency !== 'BRL') {
                conversionResult = await currencyService.convert(basePrice, baseCurrency, 'BRL');
                finalBrlAmount = conversionResult.amount;
            } else {
                conversionResult = { amount: basePrice, currency: 'BRL', symbol: 'R$', formatted: `R$ ${basePrice.toFixed(2)}` };
            }

            const creatorId = group.creatorEmail || group.creatorId;
            const syncGroup = { ...group, price: finalBrlAmount.toString(), currency: 'BRL' as const, creatorEmail: creatorId };

            const { pixCode, identifier, qrCodeImage, boletoUrl } = await syncPayService.createPayment({ email } as User, syncGroup, selectedMethod);
            
            setPixCode(pixCode);
            setPixImage(qrCodeImage);
            setBoletoUrl(boletoUrl);
            onTransactionId(identifier);
            setLoading(false);
            setCurrentView(selectedMethod);
            startPolling(identifier, creatorId, email);

        } catch (error: any) {
            console.error("Generate Payment Error:", error);
            onError(error.message || "Erro ao gerar pagamento.");
            setLoading(false);
        }
    };

    const startPolling = (id: string, ownerEmail: string, email: string) => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
        pollingInterval.current = setInterval(async () => {
            try {
                const res = await syncPayService.checkTransactionStatus(id, ownerEmail, group.id, email);
                if (res.status === 'completed' || res.status === 'paid') {
                    clearInterval(pollingInterval.current);
                    onSuccess();
                }
            } catch (e) {}
        }, 3000);
    };

    const copyPix = async () => {
        await navigator.clipboard.writeText(pixCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    if (loading) {
        return <div className="py-10 text-center"><i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#00c2ff] mb-2"></i><p className="text-xs text-gray-500">Gerando seu pagamento...</p></div>;
    }

    return (
        <div className="animate-fade-in">
            {currentView === 'selection' && (
                <div className="animate-fade-in">
                    <h3 className="text-lg font-bold text-white mb-4">Escolha como pagar</h3>
                    <div className="space-y-3">
                        <button onClick={() => generatePayment('pix')} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-all">
                            <div className="w-10 h-10 bg-[#00c2ff]/10 rounded-lg flex items-center justify-center text-[#00c2ff]"><i className="fa-solid fa-pix text-xl"></i></div>
                            <div className="text-left">
                                <div className="font-bold text-sm">Pix Instantâneo</div>
                                <div className="text-[10px] text-gray-500">Liberação imediata</div>
                            </div>
                            <i className="fa-solid fa-chevron-right ml-auto text-gray-600 text-xs"></i>
                        </button>
                        <button onClick={() => generatePayment('boleto')} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-all">
                            <div className="w-10 h-10 bg-[#aaa]/10 rounded-lg flex items-center justify-center text-[#aaa]"><i className="fa-solid fa-barcode text-xl"></i></div>
                            <div className="text-left">
                                <div className="font-bold text-sm">Boleto Bancário</div>
                                <div className="text-[10px] text-gray-500">Compensação em até 48h</div>
                            </div>
                            <i className="fa-solid fa-chevron-right ml-auto text-gray-600 text-xs"></i>
                        </button>
                    </div>
                </div>
            )}

            {currentView === 'pix' && (
                <SyncPayPixView 
                    pixCode={pixCode}
                    pixImage={pixImage}
                    isCopied={isCopied}
                    onCopy={copyPix}
                    onBack={() => setCurrentView('selection')}
                />
            )}

            {currentView === 'boleto' && (
                <SyncPayBoletoView 
                    boletoUrl={boletoUrl}
                    onBack={() => setCurrentView('selection')}
                />
            )}

            {currentView !== 'selection' && (
                <div className="text-[10px] text-gray-500 mt-6 animate-pulse">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>Aguardando confirmação do banco...
                </div>
            )}
        </div>
    );
};
