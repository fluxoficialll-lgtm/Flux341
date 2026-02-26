
import { useState, useEffect, useRef, useCallback } from 'react';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService.js';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService.js';
// import { vipSalesTracker } from '../ServiçosFrontend/pixel/trackers/VipSalesTracker';
// import { VipPlaybackController } from '../ServiçosFrontend/real/vip/VipPlaybackController';
import { useVipPricing } from './HooksComponentes/useVipPricing';
import { Group } from '../types';

export const useVipGroupSales = (groupId: string | undefined) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isPurchaseEnabled, setIsPurchaseEnabled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const [modals, setModals] = useState({
    pix: false,
    email: false,
    simulator: false,
    zoomIndex: null as number | null
  });

  const [hasCapturedEmail, setHasCapturedEmail] = useState(!!localStorage.getItem('guest_email_capture'));
  const { geoData, displayPriceInfo, setGeoData } = useVipPricing(group);

  useEffect(() => {
    const loadData = async () => {
      if (!groupId) return;
      
      try {
        const foundGroup = await groupService.fetchGroupById(groupId);
        if (foundGroup) {
          setGroup(foundGroup);
          
          const user = authService.getCurrentUser();
          const ownerFlag = !!user && (foundGroup.creatorId === user.id || foundGroup.creatorEmail === user.email);
          setIsCreator(ownerFlag);

          // vipSalesTracker.trackLanding(foundGroup);

          setIsPurchaseEnabled(foundGroup.status === 'active' || foundGroup.status === undefined);
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    };
    loadData();
  }, [groupId]);

  useEffect(() => {
    if (group && !loading) {
      const timer = setTimeout(() => {
        // vipSalesTracker.trackTimeStay60s(group);
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [group, loading]);

  const handleToggleVideo = useCallback((index: number) => {
    setPlayingIndex(prev => (prev === index ? null : index));
    if (group) {
        // vipSalesTracker.trackGalleryInteraction(group);
    }
  }, [group]);

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      
      if (index !== currentSlide) {
        setCurrentSlide(index);
        if (group) {
            // vipSalesTracker.trackGalleryInteraction(group);
        }
        setPlayingIndex(null);
      }
    }
  };

  const handlePurchaseClick = () => {
    if (!hasCapturedEmail) {
      setModals(prev => ({ ...prev, email: true }));
      return;
    }
    if (group) {
        // vipSalesTracker.trackCheckoutIntent(group);
    }
    setModals(prev => ({ ...prev, pix: true }));
  };

  const openSimulator = () => {
    setModals(prev => ({ ...prev, simulator: true }));
  };

  const onEmailSuccess = (email: string) => {
    setHasCapturedEmail(true);
    if (group) {
      // vipSalesTracker.trackLead(group, email);
      // vipSalesTracker.trackCheckoutIntent(group);
    }
    setModals(prev => ({ ...prev, email: false, pix: true }));
  };

  const closeModals = () => setModals({ pix: false, email: false, simulator: false, zoomIndex: null });

  const setZoom = (index: number) => {
    setModals(prev => ({ ...prev, zoomIndex: index }));
    if (group) {
        // vipSalesTracker.trackGalleryInteraction(group);
    }
  };

  return {
    group,
    loading,
    error,
    isCreator,
    isPurchaseEnabled,
    modals,
    currentSlide,
    playingIndex,
    carouselRef,
    displayPriceInfo,
    geoData,
    setGeoData,
    handleScroll,
    handleToggleVideo,
    handlePurchaseClick,
    openSimulator,
    closeModals,
    setZoom,
    onEmailSuccess
  };
};
