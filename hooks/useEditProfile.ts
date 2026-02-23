import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { postService } from '../ServiçosFrontend/ServiçoDePosts/postService';
import { AuthError, UserProfile } from '../types';
import { servicoDeSimulacao } from '../ServiçosFrontend/ServiçoDeSimulação';

export const useEditProfile = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<UserProfile>({
      name: '',
      nickname: '',
      bio: '',
      website: '', 
      isPrivate: false,
      photoUrl: undefined,
      cpf: '',
      phone: ''
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  // Crop states
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [rawImage, setRawImage] = useState<string>('');

  useEffect(() => {
      const user = authService.getCurrentUser();
      if (!user) {
          navigate('/');
          return;
      }

      if (user.profile) {
          setFormData({
              name: user.profile.name || '',
              nickname: user.profile.nickname || '',
              bio: user.profile.bio || '',
              website: user.profile.website || '',
              isPrivate: user.profile.isPrivate || false,
              photoUrl: user.profile.photoUrl,
              cpf: user.profile.cpf || '',
              phone: user.profile.phone || ''
          });
          if (user.profile.photoUrl) {
              setImagePreview(user.profile.photoUrl);
          }
      }
      setFetching(false);
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      
      if (name === 'name') {
          const cleanValue = value.toLowerCase().replace(/[^a-z0-9_.]/g, '');
          setFormData(prev => ({ ...prev, [name]: cleanValue }));
          setUsernameError('');
      } else {
          setFormData(prev => ({ ...prev, [name]: value }));
      }
  };

  const handleTogglePrivacy = () => {
      setFormData(prev => ({ ...prev, isPrivate: !prev.isPrivate }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setImagePreview(croppedBase64);
    fetch(croppedBase64)
      .then(res => res.blob())
      .then(blob => {
          const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
          setSelectedFile(file);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setUsernameError('');

      if (!formData.name.trim()) {
          setUsernameError('Nome de usuário é obrigatório');
          return;
      }

      setLoading(true);
      const currentUser = authService.getCurrentUser();
      const email = currentUser?.email;

      try {
          if (email && currentUser) {
              let finalPhotoUrl = formData.photoUrl;

              if (selectedFile) {
                  finalPhotoUrl = await postService.uploadMedia(selectedFile, 'avatars');
              }

              const updatedProfile = { ...formData, photoUrl: finalPhotoUrl };

              await authService.completeProfile(email, updatedProfile);
              
              const newHandle = `@${formData.name}`;
              const allPosts = servicoDeSimulacao.posts.getAll();
              
              allPosts.forEach(post => {
                  let postChanged = false;
                  if (post.authorId === currentUser.id) {
                      if (post.username !== newHandle) {
                          post.username = newHandle;
                          postChanged = true;
                      }
                      if (finalPhotoUrl && post.avatar !== finalPhotoUrl) {
                          post.avatar = finalPhotoUrl;
                          postChanged = true;
                      }
                  }
                  if (postChanged) servicoDeSimulacao.posts.update(post);
              });

              alert('Perfil atualizado com sucesso!');
              navigate('/profile', { replace: true });
          }
      } catch (err: any) {
          if (err.message === AuthError.NAME_TAKEN) {
              setUsernameError('Este nome de usuário já está em uso.');
          } else {
              setError(err.message || 'Erro ao atualizar perfil.');
          }
      } finally {
          setLoading(false);
      }
  };

  const handleBack = () => {
      if (window.history.state && window.history.state.idx > 0) {
          navigate(-1);
      } else {
          navigate('/profile');
      }
  };

  return {
    formData, setFormData, imagePreview, loading, fetching, error, usernameError,
    isCropOpen, setIsCropOpen, rawImage, handleChange, handleImageChange, 
    handleCroppedImage, handleSubmit, handleBack
  };
};