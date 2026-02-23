import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { postService } from '../ServiçosFrontend/ServiçoDePosts/postService';
import { AuthError, UserProfile } from '../types';

export const useCompleteProfile = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<Partial<UserProfile>>({
        name: '',
        nickname: '',
        bio: '',
    });
    
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [usernameError, setUsernameError] = useState('');

    const [isCropOpen, setIsCropOpen] = useState(false);
    const [rawImage, setRawImage] = useState<string>('');

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user) {
            navigate('/');
        } else if (user.profile?.name) {
            // If profile is already complete, redirect to feed
            navigate('/feed');
        }
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
        setUsernameError('');

        if (!formData.name?.trim()) {
            setUsernameError('Nome de usuário é obrigatório.');
            return;
        }

        setLoading(true);
        const currentUser = authService.getCurrentUser();
        const email = currentUser?.email;

        try {
            if (email) {
                let photoUrl: string | undefined = undefined;
                if (selectedFile) {
                    photoUrl = await postService.uploadMedia(selectedFile, 'avatars');
                }

                const finalProfile: UserProfile = {
                    name: formData.name || '',
                    nickname: formData.nickname || '',
                    bio: formData.bio || '',
                    website: '',
                    isPrivate: false,
                    photoUrl: photoUrl,
                    cpf: '',
                    phone: ''
                };

                await authService.completeProfile(email, finalProfile);
                navigate('/feed');
            }
        } catch (err: any) {
            if (err.message === AuthError.NAME_TAKEN) {
                setUsernameError('Este nome de usuário já está em uso.');
            } else {
                alert('Ocorreu um erro ao finalizar o perfil. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    return {
        formData, 
        imagePreview, 
        loading, 
        usernameError, 
        isCropOpen, 
        setIsCropOpen, 
        rawImage, 
        handleChange, 
        handleImageChange, 
        handleCroppedImage, 
        handleSubmit,
        handleLogout
    };
};