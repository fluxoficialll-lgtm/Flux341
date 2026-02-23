import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { postService } from '../ServiçosFrontend/ServiçoDePosts/postService';
import { Group } from '../types';

export const useCreatePrivateGroup = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Crop states
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [rawImage, setRawImage] = useState<string>('');

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setRawImage(ev.target?.result as string);
        setIsCropOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = (croppedBase64: string) => {
    setCoverImage(croppedBase64);
    fetch(croppedBase64)
      .then(res => res.blob())
      .then(blob => {
          const file = new File([blob], "group_cover.jpg", { type: "image/jpeg" });
          setSelectedFile(file);
      });
  };

  const handleBack = () => {
      if (window.history.state && window.history.state.idx > 0) {
          navigate(-1);
      } else {
          navigate('/create-group');
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(isCreating) return;
    setIsCreating(true);
    
    try {
        const currentUserId = authService.getCurrentUserId();
        const currentUserEmail = authService.getCurrentUserEmail();
        
        let finalCoverUrl = coverImage;
        if (selectedFile) {
            finalCoverUrl = await postService.uploadMedia(selectedFile, 'group_covers');
        }

        const newGroup: Group = {
          id: Date.now().toString(),
          name: groupName,
          description: description,
          coverImage: finalCoverUrl,
          isVip: false,
          isPrivate: true,
          lastMessage: "Grupo privado criado.",
          time: "Agora",
          creatorId: currentUserId || '',
          creatorEmail: currentUserEmail || undefined,
          memberIds: currentUserId ? [currentUserId] : [],
          adminIds: currentUserId ? [currentUserId] : []
        };

        await groupService.createGroup(newGroup);
        navigate('/groups');
    } catch (e) {
        alert("Erro ao criar grupo privado.");
    } finally {
        setIsCreating(false);
    }
  };

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
    handleSubmit,
    handleBack,
    navigate
  };
};