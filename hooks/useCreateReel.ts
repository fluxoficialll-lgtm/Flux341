
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { reelsService } from '../ServiçosFrontend/ServiçoDeReels/reelsService.js';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { contentSafetyService } from '../ServiçosFrontend/ServiçoDeSegurançaDeConteúdo/contentSafetyService.js';
import { Group } from '../types';

export const useCreateReel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedGroup = location.state?.groupId as string | undefined;

  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(preselectedGroup || 'none');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser?.id) {
      const groups = groupService.getUserGroups(currentUser.id);
      setUserGroups(groups);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecione um arquivo de vídeo.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || isCreating) return;

    setIsCreating(true);

    try {
      const isSafe = await contentSafetyService.isTextSafe(description);
      if (!isSafe) {
        alert('Sua descrição contém palavras que não são permitidas. Por favor, revise o texto.');
        setIsCreating(false);
        return;
      }

      const videoUrl = await reelsService.uploadReel(videoFile, setUploadProgress);

      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      await reelsService.createReel({
        description,
        videoUrl,
        userId: user.id,
        userAvatar: user.profile?.photoUrl,
        username: user.profile?.name || "Usuário",
        groupId: selectedGroupId !== 'none' ? selectedGroupId : undefined,
      });

      if (selectedGroupId !== 'none') {
        navigate(`/group/${selectedGroupId}`);
      } else {
        navigate('/feed');
      }

    } catch (error) {
      console.error("Erro ao criar o Reel:", error);
      alert('Ocorreu um erro ao criar seu Reel. Tente novamente.');
      setIsCreating(false);
      setUploadProgress(0);
    }
  };

  return {
    description, setDescription,
    videoPreview,
    isCreating,
    uploadProgress,
    userGroups,
    selectedGroupId, setSelectedGroupId,
    handleFileChange,
    handleSubmit,
    navigate
  };
};
