
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reelsService } from '../ServiçosFrontend/ServiçoDeReels/reelsService.js';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { Post } from '../types';

export type CategoryFilter = 'relevant' | 'recent' | 'watched' | 'unwatched' | 'liked';

export const useReelsSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('relevant');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    const email = authService.getCurrentUserEmail();
    if(email) setCurrentUserEmail(email);
  }, []);

  useEffect(() => {
    setLoading(true);
    
    const timeoutId = setTimeout(() => {
        const searchResults = reelsService.searchReels(
            searchTerm, 
            activeCategory, 
            currentUserEmail
        );
        
        setResults(searchResults);
        setLoading(false);
    }, 400); // 400ms debounce

    return () => clearTimeout(timeoutId);

  }, [searchTerm, activeCategory, currentUserEmail]);

  const handleNavigate = (path: string) => {
      navigate(path);
  };

  return {
    searchTerm, 
    setSearchTerm, 
    activeCategory, 
    setActiveCategory, 
    results, 
    loading, 
    currentUserEmail,
    handleNavigate
  };
};
