
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Group, VipMediaItem } from '../../../../types';
import { postService } from '../../../../ServiçosDoFrontend/postService';

export const useGroupVIP = (group: Group | null) => {
  const [vipPrice, setVipPrice] = useState('');
  const [vipCurrency, setVipCurrency] = useState<'BRL' | 'USD'>('BRL');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [pixelId, setPixelId] = useState('');
  const [pixelToken, setPixelToken] = useState('');
  const [vipDoorText, setVipDoorText] = useState('');
  const [vipButtonText, setVipButtonText] = useState('');
  const [vipMediaItems, setVipMediaItems] = useState<VipMediaItem[]>([]);

  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCurrent, setUploadCurrent] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);

  useEffect(() => {
    if (group?.isVip) {
      setVipPrice(group.price || '');
      setVipCurrency((group.currency as any) || 'BRL');
      setSelectedProviderId(group.selectedProviderId || null);
      setPixelId(group.pixelId || '');
      setPixelToken(group.pixelToken || '');
      setVipDoorText(group.vipDoor?.text || '');
      setVipButtonText(group.vipDoor?.buttonText || '');
      setVipMediaItems(group.vipDoor?.mediaItems || (group.vipDoor?.media ? [{url: group.vipDoor.media, type: 'image'}] : []));
    }
  }, [group]);

  const handleGalleryMediaAdd = async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files) as File[];
      const availableSlots = 10 - vipMediaItems.length;
      const toUpload = fileArray.slice(0, availableSlots);

      if (toUpload.length === 0) {
          alert("Limite de 10 mídias atingido.");
          return;
      }

      setIsUploading(true);
      setUploadTotal(toUpload.length);
      setUploadCurrent(0);
      setUploadProgress(0);

      const newItems: VipMediaItem[] = [];

      for (let i = 0; i < toUpload.length; i++) {
          const file = toUpload[i];
          setUploadCurrent(i + 1);
          setUploadProgress(Math.round((i / toUpload.length) * 100));

          try {
              const url = await postService.uploadMedia(file, 'vips_doors');
              const type = file.type.startsWith('video') ? 'video' as const : 'image' as const;
              
              newItems.push({ url, type });
              setUploadProgress(Math.round(((i + 1) / toUpload.length) * 100));
          } catch (err) {
              console.error("Erro no upload de mídia VIP:", err);
          }
      }

      if (newItems.length > 0) {
          setVipMediaItems(prevItems => [...prevItems, ...newItems]);
      }

      setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
      }, 1000);
  };

  const moveVipMediaItem = (index: number, direction: 'left' | 'right') => {
    const newItems = [...vipMediaItems];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    // Swap
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setVipMediaItems(newItems);
  };

  const pixelConfig = useMemo(() => ({
    metaId: pixelId,
    metaToken: pixelToken
  }), [pixelId, pixelToken]);

  const updatePlatformPixel = (platform: string, data: { pixelId: string, pixelToken: string }) => {
    if (platform === 'meta') {
      setPixelId(data.pixelId);
      setPixelToken(data.pixelToken);
    }
  };

  return {
    state: { 
      vipPrice, 
      vipCurrency, 
      selectedProviderId,
      pixelId, 
      pixelToken, 
      vipDoorText, 
      vipButtonText, 
      vipMediaItems,
      pixelConfig,
      // Upload state
      isUploading,
      uploadProgress,
      uploadCurrent,
      uploadTotal
    },
    actions: { 
      setVipPrice, 
      setVipCurrency, 
      setSelectedProviderId,
      setPixelId, 
      setPixelToken, 
      setVipDoorText, 
      setVipButtonText, 
      setVipMediaItems,
      updatePlatformPixel,
      moveVipMediaItem,
      handleGalleryMediaAdd
    },
    getVipPayload: () => ({
      price: vipPrice.replace(',', '.'),
      currency: vipCurrency,
      selectedProviderId: selectedProviderId || undefined,
      pixelId,
      pixelToken,
      vipDoor: group?.isVip ? { 
        ...group.vipDoor, 
        text: vipDoorText, 
        buttonText: vipButtonText, 
        mediaItems: vipMediaItems 
      } : undefined
    })
  };
};
