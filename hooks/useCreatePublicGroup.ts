
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { fileService } from '../ServiçosFrontend/ServiçoDeArquivos/fileService.js';

export const useCreatePublicGroup = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            setRawImage(e.target?.result as string);
            setIsCropOpen(true);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = async (image: string) => {
    setIsCropOpen(false);
    setCoverImage(image);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!groupName) return;

    setIsCreating(true);
    try {
        const creatorId = authService.getCurrentUserId();
        if (!creatorId) throw new Error('User not authenticated');

        let coverImageUrl = '';
        if (coverImage) {
            const blob = await fetch(coverImage).then(res => res.blob());
            coverImageUrl = await fileService.upload(blob, `group-covers/${Date.now()}.png`);
        }

        await groupService.createGroup({
            name: groupName,
            description,
            creatorId,
            coverImageUrl,
            groupType: 'public'
        });

        navigate('/groups');
    } catch (error) {
        console.error("Failed to create group:", error);
    } finally {
        setIsCreating(false);
    }
  };

  const handleBack = () => navigate('/create-group');

  return {
    groupName,
    setGroupName,
    description,
    setDescription,
    coverImage,
    isCreating,
    isCropOpen,
    setIsCropOpen,
    rawImage,
    handleCoverChange,
    handleCroppedImage,
    handleBack,
    handleSubmit,
    navigate
  };
};
