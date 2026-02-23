import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../ServiçosFrontend/ServiçoDePosts/postService';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { Post } from '../types';

export const useAdContentSelector = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');
    const [content, setContent] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            const user = authService.getCurrentUser();
            if (user) {
                const allPosts = await postService.getUserPosts(user.id);
                setContent(allPosts);
            }
            setLoading(false);
        };
        loadContent();
    }, []);

    const filteredContent = content.filter(p => 
        activeTab === 'reels' ? p.type === 'video' : (p.type === 'photo' || p.type === 'text')
    );

    const handleSelect = (post: Post) => {
        navigate('/ad-placement-selector', { state: { boostedContent: post } });
    };

    return {
        activeTab,
        setActiveTab,
        loading,
        filteredContent,
        handleSelect,
        navigate
    };
};