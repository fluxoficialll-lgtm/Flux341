
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { postService } from '../ServiçosFrontend/ServiçoDePosts/postServiceFactory';
import { authService, groupService } from '../ServiçosFrontend/ServiçoDeSimulação/serviceFactory';
import { contentSafetyService } from '../ServiçosFrontend/ServiçoDeSegurançaDeConteúdo/contentSafetyService.js';
import { adService } from '../ServiçosFrontend/ServiçoDeAnúncios/adService.js';
import { Post, Group } from '../types';

interface MediaPreview {
  file: File;
  url: string;
  type: 'image';
}

const LOCATIONS: any = {
    "Brasil": {
        "Ceará": ["Fortaleza", "Eusébio", "Aquiraz", "Sobral"],
        "São Paulo": ["São Paulo", "Campinas", "Santos", "Guarulhos"],
        "Rio de Janeiro": ["Rio de Janeiro", "Niterói", "Cabo Frio"],
        "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Ouro Preto"]
    },
    "Estados Unidos": {
        "California": ["Los Angeles", "San Francisco", "San Diego"],
        "New York": ["New York City", "Buffalo"],
        "Florida": ["Miami", "Orlando"]
    },
    "Portugal": {
        "Lisboa": ["Lisboa", "Sintra", "Cascais"],
        "Porto": ["Porto", "Vila Nova de Gaia"]
    }
};

export const useCreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { isAd?: boolean } | null;
  const isAd = locationState?.isAd || false;

  const [text, setText] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaPreview[]>([]);
  const [isPublishDisabled, setIsPublishDisabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Ad Specific
  const [adBudget, setAdBudget] = useState('');
  const [adLink, setAdLink] = useState('');

  // Configs
  const [isAdultContent, setIsAdultContent] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [targetCountry, setTargetCountry] = useState('');
  const [targetState, setTargetState] = useState('');
  const [targetCity, setTargetCity] = useState('');
  const [displayLocation, setDisplayLocation] = useState('Global');

  // Groups
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  
  // Auto-Sales
  const [autoSalesEnabled, setAutoSalesEnabled] = useState(true);

  const user = authService.getCurrentUser();
  const username = user?.profile?.name ? `@${user.profile.name}` : "@usuario";
  const avatarUrl = user?.profile?.photoUrl;

  useEffect(() => {
    const textLength = text.trim().length;
    const hasMedia = mediaFiles.length > 0;
    const adValid = isAd ? (adBudget && parseFloat(adBudget) >= 10) : true;
    
    let groupValid = true;
    if (selectedGroup && (selectedGroup as any).status === 'inactive') {
        groupValid = false;
    }

    setIsPublishDisabled(!(textLength > 0 || hasMedia || (selectedGroup && groupValid)) || !adValid || isProcessing);
  }, [text, mediaFiles, isProcessing, adBudget, isAd, selectedGroup]);

  // Correção Definitiva: Usa o `groupService` adaptado e unificado.
  useEffect(() => {
    const fetchMyGroups = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser?.email) {
        try {
          // A chamada agora é para o método `getGroups` do adaptador.
          const allGroups = await groupService.getGroups();
          const ownedGroups = allGroups.filter((g: Group) => g.creatorEmail === currentUser.email);
          setMyGroups(ownedGroups);
        } catch (error) {
          console.error("Erro ao buscar os grupos do usuário:", error);
          setMyGroups([]);
        }
      }
    };

    fetchMyGroups();
  }, []);

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) {
      if (files.length + mediaFiles.length > 5) {
          alert("Limite de 5 arquivos.");
          return;
      }
      const newPreviews: MediaPreview[] = files.map(file => ({
          file: file,
          url: URL.createObjectURL(file),
          type: 'image'
      }));
      setMediaFiles(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveMedia = (index: number) => {
      setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
    } else {
        navigate('/feed');
    }
  };

  const handlePublishClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPublishDisabled || !user) return;
    setIsProcessing(true);

    setTimeout(async () => {
        try {
            const uploadPromises = mediaFiles.map(m => postService.uploadMedia(m.file));
            const uploadedRaw = await Promise.all(uploadPromises);
            const uploadedUrls = uploadedRaw.filter(u => u !== "");

            const analysis = await contentSafetyService.analyzeContent(text, uploadedUrls.map(u => ({ url: u })));
            let finalAdultStatus = isAdultContent;
            if (analysis.isAdult) finalAdultStatus = true;

            const mainMediaUrl = uploadedUrls.length > 0 ? uploadedUrls[0] : undefined;

            const newPost: Post = {
              id: Date.now().toString(),
              type: uploadedUrls.length > 0 ? 'photo' : 'text',
              authorId: user.id,
              username: username,
              avatar: avatarUrl,
              text: text,
              image: mainMediaUrl,
              images: uploadedUrls.length > 0 ? uploadedUrls : undefined,
              video: undefined,
              time: "Agora",
              timestamp: Date.now(),
              isPublic: true,
              isAdultContent: finalAdultStatus,
              isAd: isAd,
              views: 0,
              likes: 0,
              comments: 0,
              liked: false,
              location: displayLocation === 'Global' ? undefined : displayLocation,
              relatedGroupId: selectedGroup?.id
            };

            await postService.addPost(newPost);
            
            if (selectedGroup?.isVip && autoSalesEnabled) {
                await adService.createCampaign({
                    id: Date.now().toString(),
                    ownerId: user.id,
                    name: `Auto-Boost: ${selectedGroup.name}`,
                    ownerEmail: user.email,
                    scheduleType: 'continuous',
                    budget: 0,
                    pricingModel: 'commission',
                    trafficObjective: 'conversions',
                    creative: { text: text, mediaUrl: mainMediaUrl, mediaType: 'image' },
                    campaignObjective: 'group_joins',
                    destinationType: 'group',
                    targetGroupId: selectedGroup.id,
                    optimizationGoal: 'group_joins',
                    placements: ['feed', 'reels', 'marketplace'],
                    ctaButton: 'Entrar',
                    status: 'active',
                    timestamp: Date.now()
                });
            }
            
            if (selectedGroup) {
                navigate(`/group-chat/${selectedGroup.id}`);
            } else {
                navigate('/feed');
            }
        } catch (error: any) {
            console.error("Erro ao publicar:", error);
            alert("Erro ao publicar.");
        } finally {
            setIsProcessing(false);
        }
    }, 50);
  };

  // Location Helpers
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTargetCountry(e.target.value); setTargetState(''); setTargetCity('');
  };
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTargetState(e.target.value); setTargetCity('');
  };
  const saveLocation = () => {
      let loc = 'Global';
      if (targetCity) loc = `${targetCity}, ${targetState}`; 
      else if (targetState) loc = `${targetState}, Brasil`;
      else if (targetCountry) loc = targetCountry === 'Brasil' ? 'Global' : targetCountry;
      setDisplayLocation(loc);
      setIsLocationModalOpen(false);
  };

  const countries = Object.keys(LOCATIONS);
  const states = targetCountry ? Object.keys(LOCATIONS[targetCountry] || {}) : [];
  const cities = (targetCountry && targetState) ? LOCATIONS[targetCountry][targetState] || [] : [];

  return {
    isAd, text, setText, mediaFiles, isPublishDisabled, isProcessing, adBudget, setAdBudget, adLink, setAdLink,
    isAdultContent, setIsAdultContent, isLocationModalOpen, setIsLocationModalOpen, displayLocation, 
    isGroupModalOpen, setIsGroupModalOpen, myGroups, selectedGroup, setSelectedGroup, autoSalesEnabled,
    avatarUrl, username, handleMediaChange, handleRemoveMedia, handleBack, handlePublishClick,
    targetCountry, setTargetCountry, targetState, setTargetState, targetCity, setTargetCity,
    handleCountryChange, handleStateChange, saveLocation, countries, states, cities, navigate
  };
};