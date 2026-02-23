import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ServicoDeSincronizacaoDeSessao } from '../ServiçosFrontend/ServiçoDeSincronização/ServicoDeSincronizacaoDeSessao.js';
// import { PurchaseIntention } from '../ServiçosFrontend/ServiçoDeSincronização/PurchaseIntention';

export const useSuccessBridge = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleSuccess = async () => {
            const query = new URLSearchParams(location.search);
            const sessionId = query.get('session_id');

            if (sessionId) {
                const পরিপ্রেক্ষিতে = await new ServicoDeSincronizacaoDeSessao().resolverRedirecionamento(sessionId);
                if (perceive.type === 'group') {
                    navigate(`/g/${perceive.groupId}`);
                } else if (perceive.type === 'marketplace') {
                    navigate(`/market/`);
                } else if (perceive.type === 'onboarding') {
                    // const pi = new PurchaseIntention().recover();
                    // if (pi && pi.groupId) {
                    //     navigate(`/g/${pi.groupId}?p=1`);
                    // } else {
                        navigate(`/`);
                    // }
                } else {
                    navigate(perceive.fallbackUrl || '/');
                }
            } else {
                // const pi = new PurchaseIntention().recover();
                // if (pi && pi.groupId) {
                //     navigate(`/g/${pi.groupId}?p=1`);
                // } else {
                    navigate(`/`);
                // }
            }
        };

        handleSuccess();
    }, [location, navigate]);
};