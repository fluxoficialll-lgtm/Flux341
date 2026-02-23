import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { metaPixelService } from '../ServiçosFrontend/metaPixelService';
import { postService } from '../ServiçosFrontend/ServiçoDePosts/postService';
import { Group, VipMediaItem } from '../types';

export const useEditGroup = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Form States
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'BRL' | 'USD' | 'EUR'>('BRL');
  const [accessType, setAccessType] = useState<'lifetime' | 'temporary'>('lifetime');
  const [expirationDate, setExpirationDate] = useState('');
  const [originalGroup, setOriginalGroup] = useState<Group | null>(null);
  
  // Advanced Marketing
  const [pixelId, setPixelId] = useState('');
  const [pixelToken, setPixelToken] = useState('');
  const [marketingStatus, setMarketingStatus] = useState<'active' | 'inactive'>('inactive');
  const [isTestingPixel, setIsTestingPixel] = useState(false);

  // Modal States
  const [isVipDoorModalOpen, setIsVipDoorModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  
  // Vip Door Settings
  const [vipDoorMediaItems, setVipDoorMediaItems] = useState<{file?: File, url: string, type: 'image' | 'video'}[]>([]);
  const [vipDoorText, setVipDoorText] = useState('');
  const [vipButtonText, setVipButtonText] = useState(''); 

  // Upload Progress States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCurrent, setUploadCurrent] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);

  useEffect(() => {
      if (!id) {
          navigate('/groups');
          return;
      }
      const group = groupService.getGroupById(id);
      if (!group) {
          alert("Grupo não encontrado.");
          navigate('/groups');
          return;
      }

      setOriginalGroup(group);
      setGroupName(group.name);
      setDescription(group.description);
      setCoverImage(group.coverImage);
      setPixelId(group.pixelId || '');
      setPixelToken(group.pixelToken || '');
      
      if (group.pixelId) setMarketingStatus('active');
      
      if (group.price) {
          const numeric = parseFloat(group.price);
          if (!isNaN(numeric)) {
              setPrice(numeric.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
          } else {
              setPrice(group.price);
          }
      }
      
      setCurrency((group.currency as any) || 'BRL');
      setAccessType(group.accessType as any || 'lifetime');
      setExpirationDate(group.expirationDate || '');
      
      if (group.vipDoor) {
          setVipDoorText(group.vipDoor.text || '');
          setVipButtonText(group.vipDoor.buttonText || '');
          if (group.vipDoor.mediaItems) {
              setVipDoorMediaItems(group.vipDoor.mediaItems);
          } else if (group.vipDoor.media) {
              setVipDoorMediaItems([{ 
                  url: group.vipDoor.media, 
                  type: (group.vipDoor.mediaType as any) || 'image' 
              }]);
          }
      }
  }, [id, navigate]);

  useEffect(() => {
      if (pixelId.length > 5) setMarketingStatus('active');
      else setMarketingStatus('inactive');
  }, [pixelId]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCoverFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setCoverImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVipDoorMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files) as File[];
    if (vipDoorMediaItems.length + fileArray.length > 10) {
        alert("Máximo de 10 mídias.");
        return;
    }
    const newItems = fileArray.map(f => ({
        file: f,
        url: URL.createObjectURL(f),
        type: f.type.startsWith('video/') ? 'video' as const : 'image' as const
    }));
    setVipDoorMediaItems(prev => [...prev, ...newItems]);
  };

  const removeMediaItem = (index: number) => {
      setVipDoorMediaItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAccessTypeChange = (type: 'lifetime' | 'temporary') => {
    setAccessType(type);
    if (type === 'temporary') setIsDateModalOpen(true);
    else setExpirationDate('');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      value = value.replace(/\D/g, "");
      if (value === "") { setPrice(""); return; }
      const numericValue = parseFloat(value) / 100;
      setPrice(numericValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalGroup || isUploading) return;

    const rawPrice = price.replace(/\./g, '').replace(',', '.');
    const numericPrice = parseFloat(rawPrice);

    if (originalGroup.isVip && (isNaN(numericPrice) || numericPrice < 6)) {
        alert("⚠️ O preço mínimo para um grupo VIP é R$ 6,00.");
        return;
    }

    setIsUploading(true);
    try {
        const filesToUpload = vipDoorMediaItems.filter(i => i.file);
        const staticItems = vipDoorMediaItems.filter(i => !i.file);
        const totalToUpload = filesToUpload.length + (selectedCoverFile ? 1 : 0);
        
        setUploadTotal(totalToUpload);
        setUploadCurrent(0);
        setUploadProgress(0);

        let finalCoverUrl = coverImage;
        let uploadedCount = 0;

        if (selectedCoverFile) {
            uploadedCount++;
            setUploadCurrent(uploadedCount);
            finalCoverUrl = await postService.uploadMedia(selectedCoverFile, 'avatars');
            setUploadProgress(Math.round((uploadedCount / totalToUpload) * 100));
        }

        const uploadedVipMedia: VipMediaItem[] = [];
        for (const item of filesToUpload) {
            uploadedCount++;
            setUploadCurrent(uploadedCount);
            const url = await postService.uploadMedia(item.file!, 'vips_doors');
            uploadedVipMedia.push({ url, type: item.type });
            setUploadProgress(Math.round((uploadedCount / totalToUpload) * 100));
        }

        const finalMediaGallery = [...staticItems.map(i => ({ url: i.url, type: i.type })), ...uploadedVipMedia];

        const updatedGroup: Group = {
          ...originalGroup,
          name: groupName,
          description: description,
          coverImage: finalCoverUrl,
          price: numericPrice.toString(),
          currency: currency,
          accessType: accessType,
          expirationDate: expirationDate,
          vipDoor: {
            mediaItems: finalMediaGallery,
            text: vipDoorText,
            buttonText: vipButtonText
          },
          pixelId: pixelId || undefined,
          pixelToken: pixelToken || undefined
        };

        await groupService.updateGroup(updatedGroup);
        
        setTimeout(() => {
            setIsUploading(false);
            navigate('/groups');
        }, 800);

    } catch (e) {
        alert("Erro ao atualizar grupo.");
        setIsUploading(false);
    }
  };

  return {
    navigate, groupName, setGroupName, description, setDescription, coverImage, handleCoverChange, price, handlePriceChange,
    currency, setCurrency, accessType, handleAccessTypeChange, expirationDate, setExpirationDate, pixelId, setPixelId, 
    pixelToken, setPixelToken, marketingStatus, isVipDoorModalOpen, setIsVipDoorModalOpen, isCurrencyModalOpen, 
    setIsCurrencyModalOpen, vipDoorMediaItems, handleVipDoorMediaChange, removeMediaItem, vipDoorText, setVipDoorText, 
    vipButtonText, setVipButtonText, handleSubmit, isUploading, uploadProgress, uploadCurrent, uploadTotal
  };
};