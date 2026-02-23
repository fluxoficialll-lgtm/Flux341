
import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { marketplaceService } from '../ServiçosFrontend/ServiçoDeMarketplace/marketplaceService.js';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { postService } from '../ServiçosFrontend/ServiçoDePosts/postService';
import { MarketplaceItem } from '../types';

export const useCreateMarketplaceItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { type?: 'paid' | 'organic' } | null;
  const isPaid = state?.type === 'paid';
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Eletrônicos');
  const [locationVal, setLocationVal] = useState('');
  const [description, setDescription] = useState('');
  
  // Media State
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [additionalMedia, setAdditionalMedia] = useState<{file: File, url: string, type: 'image' | 'video'}[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCoverFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setCoverImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      const fileArray = (Array.from(files) as File[]).slice(0, 5); 
      
      const newEntries = fileArray.map(file => ({
          file: file,
          url: URL.createObjectURL(file),
          type: file.type.startsWith('video/') ? 'video' as const : 'image' as const
      }));
      setAdditionalMedia(prev => [...prev, ...newEntries]);
  };

  const removeGalleryItem = (index: number) => {
      setAdditionalMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
    } else {
        navigate('/marketplace');
    }
  };

  // Currency Mask
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      value = value.replace(/\D/g, "");
      if (value === "") { setPrice(""); return; }
      const numericValue = parseFloat(value) / 100;
      setPrice(numericValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !coverImage || isSubmitting) return;

    setIsSubmitting(true);
    try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return;

        let finalCoverUrl = coverImage || '';
        if (selectedCoverFile) {
            finalCoverUrl = await postService.uploadMedia(selectedCoverFile, 'marketplace');
        }

        const uploadedImages: string[] = [];
        let finalVideoUrl: string | undefined = undefined;

        for (const item of additionalMedia) {
            const url = await postService.uploadMedia(item.file, 'marketplace');
            if (item.type === 'video' && !finalVideoUrl) {
                finalVideoUrl = url;
            } else {
                uploadedImages.push(url);
            }
        }

        const rawPrice = price.replace(/\./g, '').replace(',', '.');
        const numericPrice = parseFloat(rawPrice);

        const newItem: MarketplaceItem = {
            id: Date.now().toString(),
            title,
            price: numericPrice,
            category,
            location: locationVal,
            description,
            image: finalCoverUrl, 
            images: uploadedImages, 
            video: finalVideoUrl, 
            sellerId: currentUser.id,
            sellerName: currentUser.profile?.name || 'Usuário',
            sellerAvatar: currentUser.profile?.photoUrl,
            timestamp: Date.now(),
            soldCount: 0 
        };

        await marketplaceService.createItem({ item: newItem });
        navigate('/marketplace');
    } catch (e) {
        console.error("Marketplace Publish Error:", e);
        alert("Erro ao publicar anúncio no servidor.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return {
    isPaid, title, setTitle, price, handlePriceChange, category, setCategory, locationVal, setLocationVal,
    description, setDescription, coverImage, additionalMedia, isSubmitting, handleCoverChange, handleGalleryChange,
    removeGalleryItem, handleBack, handleSubmit, navigate
  };
};
