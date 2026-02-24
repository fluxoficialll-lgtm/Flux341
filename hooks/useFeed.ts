
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authServiceFactory'; // Corrigido para usar a factory
import { postService } from '../ServiçosFrontend/ServiçoDePosts/postServiceFactory';
import { recommendationService } from '../ServiçosFrontend/ServiçoDeRecomendação/recommendationService.js';
import { Post } from '../types';

export const useFeed = () => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const loaderRef = useRef<HTMLDivElement>(null);
    
    const [posts, setPosts] = useState<Post[]>([]);
    const [uiVisible, setUiVisible] = useState(true);
    const [activeLocationFilter, setActiveLocationFilter] = useState<string | null>(null);
    const [nextCursor, setNextCursor] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isFetchingRef = useRef(false);
    const viewedPostsRef = useRef<Set<string>>(new Set());
    const lastScrollY = useRef(0);
    const PAGE_SIZE = 15;

    const currentUser = useMemo(() => authService.getCurrentUser(), []);
    const currentUserId = currentUser?.id;
    const isAdultContentAllowed = useMemo(() => localStorage.getItem('settings_18_plus') === 'true', []);

    const mergePosts = useCallback((newPosts: Post[], reset: boolean = false) => {
        if (!newPosts) return;
        setPosts(prev => {
            const combined = reset ? newPosts : [...prev, ...newPosts];
            const uniqueMap = new Map<string, Post>();
            combined.forEach(p => { if (p && p.id && !uniqueMap.has(p.id)) { uniqueMap.set(p.id, p); } });

            const scored = Array.from(uniqueMap.values()).map(p => ({ p, score: recommendationService.scorePost(p, currentUser?.email) }));
            return scored.sort((a, b) => b.score - a.score).map(item => item.p);
        });
    }, [currentUser?.email]);

    const fetchPosts = useCallback(async (cursor?: number, reset = false) => {
        if (isFetchingRef.current && !reset) return;
        isFetchingRef.current = true;
        if (!cursor || reset) setLoading(true);
        
        try {
            const storedFilter = localStorage.getItem('feed_location_filter');
            const filterValue = (storedFilter === 'Global' || !storedFilter) ? null : storedFilter;
            
            const response = await postService.listPosts(authService.getToken(), { 
                limit: PAGE_SIZE, 
                cursor: cursor, 
                locationFilter: filterValue, 
                allowAdultContent: isAdultContentAllowed 
            });

            const fetched = (response.data || []).filter(p => p && (p.type !== 'video' || p.isAd));
            mergePosts(fetched, reset || cursor === undefined);
            setNextCursor(response.nextCursor);
            setHasMore(!!response.nextCursor && fetched.length > 0);
        } catch (error) {
            console.error("Erro ao buscar posts do feed:", error);
            if (!cursor || reset) setHasMore(false);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [isAdultContentAllowed, mergePosts]);

    // Efeito para carregar os posts iniciais e lidar com filtros
    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/');
            return;
        }
        
        const filter = localStorage.getItem('feed_location_filter');
        setActiveLocationFilter(filter);
        
        // Sempre busca os posts da rede (que será interceptada pelo mock)
        fetchPosts(undefined, true); 

    }, [navigate, fetchPosts]);

    // Efeito para observador de visualização (incrementar views)
    useEffect(() => {
        if (posts.length === 0) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const postId = entry.target.getAttribute('data-post-id');
                    if (postId && !viewedPostsRef.current.has(postId)) {
                        viewedPostsRef.current.add(postId);
                        postService.incrementView(postId);
                        recommendationService.trackImpression(postId);
                    }
                }
            });
        }, { threshold: 0.15 });
        const postElements = document.querySelectorAll('.feed-post-item');
        postElements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [posts]);

    // Efeito para scroll infinito
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !loading && !isFetchingRef.current && nextCursor) {
                fetchPosts(nextCursor);
            }
        }, { root: null, threshold: 0.1 });
        
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore, nextCursor, fetchPosts, loading]);

    // Efeito para controlar a visibilidade da UI no scroll
    const handleContainerScroll = () => {
        if (!scrollContainerRef.current) return;
        const currentScroll = scrollContainerRef.current.scrollTop;
        setUiVisible(currentScroll <= lastScrollY.current || currentScroll <= 100);
        lastScrollY.current = currentScroll;
    };

    // --- Funções de Ação do Post ---

    const handlePostDelete = async (id: string) => {
        await postService.deletePost(id);
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    const handlePostLike = (id: string) => {
        postService.toggleLike(id);
        // Opcional: Atualizar a UI imediatamente para melhor UX
        setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
    };
    
    const handlePostVote = (postId: string, index: number) => {
        // A lógica de votação pode precisar ser ajustada para o mock
        postService.voteOnPoll(postId, index); 
        setPosts(prev => prev.map(p => {
            if (p.id === postId && p.pollOptions && p.votedOptionIndex == null) {
                const newOptions = [...p.pollOptions];
                newOptions[index].votes += 1;
                return { ...p, pollOptions: newOptions, votedOptionIndex: index };
            }
            return p;
        }));
    };

    const handlePostShare = async (p: Post) => {
        const url = `${window.location.origin}/#/post/${p.id}`;
        if (navigator.share) {
            try { await navigator.share({ title: `Post de ${p.username}`, url }); } catch (err) {}
        } else {
            navigator.clipboard.writeText(url);
            alert('Link copiado!');
        }
        postService.incrementShare(p.id);
    };
    
    const handleCtaClick = (link: string | undefined) => {
        if(link) {
            link.startsWith('http') ? window.open(link,'_blank') : navigate(link);
        }
    };

    return {
        scrollContainerRef, loaderRef, posts, loading, hasMore, currentUserId, uiVisible,
        activeLocationFilter, isMenuOpen, setIsMenuOpen, handleContainerScroll,
        handlePostLike, handlePostDelete, handlePostVote, handlePostShare, handleCtaClick,
        navigate
    };
};
