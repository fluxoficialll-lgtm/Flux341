
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adService } from '../ServiçosFrontend/ServiçoDeAnúncios/adService.js';
import { AdCampaign } from '../types';

export const useCampaignPerformance = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [campaign, setCampaign] = useState<Partial<AdCampaign> | null>(null);
    const [metrics, setMetrics] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [previewTab, setPreviewTab] = useState<'feed' | 'reels' | 'marketplace'>('feed');
    const [editCopy, setEditCopy] = useState('');
    const [editCta, setEditCta] = useState('');
    const [editMediaUrl, setEditMediaUrl] = useState<string | undefined>(undefined);
    const [editMediaType, setEditMediaType] = useState<'image' | 'video'>('image');

    const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const hasChanges = useMemo(() => {
        if (!campaign) return false;
        return editCopy !== (campaign.creative?.text || '') || 
               editCta !== (campaign.placementCtas?.[previewTab] || campaign.ctaButton) ||
               editMediaUrl !== (campaign.placementCreatives?.[previewTab]?.mediaUrl || campaign.creative?.mediaUrl);
    }, [campaign, editCopy, editCta, editMediaUrl, previewTab]);

    const loadAllData = useCallback(async () => {
        if (!id) { navigate('/my-store'); return; }
        setLoading(true);
        setError(null);
        try {
            const selectedCamp = adService.getCampaignById(id);
            if (selectedCamp) {
                setCampaign(selectedCamp);
                setEditCopy(selectedCamp.creative?.text || '');
                setEditCta(selectedCamp.placementCtas?.[previewTab] || selectedCamp.ctaButton || 'saiba mais');
                setEditMediaUrl(selectedCamp.placementCreatives?.[previewTab]?.mediaUrl || selectedCamp.creative?.mediaUrl);
                setEditMediaType(selectedCamp.placementCreatives?.[previewTab]?.mediaType || selectedCamp.creative?.mediaType || 'image');

                const perfData = await adService.getCampaignPerformance(id);
                if (perfData) setMetrics(perfData);
                else setError("Não foi possível processar as métricas desta campanha.");
            } else {
                setError("Campanha não encontrada no banco de dados.");
            }
        } catch (err) {
            console.error("Dashboard error:", err);
            setError("Ocorreu um erro ao sincronizar os dados.");
        } finally {
            setLoading(false);
        }
    }, [id, navigate, previewTab]);

    useEffect(() => {
        loadAllData();
    }, [id, navigate]);
    
    useEffect(() => {
        if (campaign) {
            setEditCta(campaign.placementCtas?.[previewTab] || campaign.ctaButton || 'saiba mais');
            setEditMediaUrl(campaign.placementCreatives?.[previewTab]?.mediaUrl || campaign.creative?.mediaUrl);
            setEditMediaType(campaign.placementCreatives?.[previewTab]?.mediaType || campaign.creative?.mediaType || 'image');
        }
    }, [previewTab, campaign]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setEditMediaUrl(ev.target?.result as string);
                setEditMediaType(file.type.startsWith('video/') ? 'video' : 'image');
            };
            reader.readAsDataURL(file);
        }
    };

    const updateCampaign = async () => {
        if (!id || !campaign || updating || !hasChanges) return false;
        setUpdating(true);
        try {
            const updates: Partial<AdCampaign> = {
                creative: { ...campaign.creative, text: editCopy },
                placementCtas: { ...campaign.placementCtas, [previewTab]: editCta },
                placementCreatives: {
                    ...campaign.placementCreatives,
                    [previewTab]: { mediaUrl: editMediaUrl, mediaType: editMediaType }
                }
            };
            await adService.updateCampaign(id, updates);
            setCampaign(prev => ({ ...prev, ...updates }));
            return true;
        } catch (e) {
            return false;
        } finally {
            setUpdating(false);
        }
    };

    return {
        loading, updating, campaign, metrics, error, navigate, formatCurrency,
        previewTab, setPreviewTab,
        editCopy, setEditCopy,
        editCta, setEditCta,
        editMediaUrl, editMediaType, handleFileChange,
        hasChanges, updateCampaign
    };
};
