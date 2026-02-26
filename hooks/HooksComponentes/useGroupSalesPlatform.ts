
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroupSettings } from './useGroupSettings';
import { SalesFolder, SalesSection, Channel } from '../types';

export const useGroupSalesPlatform = () => {
    const navigate = useNavigate();
    const { group, loading, handleSave, form } = useGroupSettings();

    const [optionsModal, setOptionsModal] = useState<{
        isOpen: boolean;
        target: SalesFolder | SalesSection | Channel | null;
        type: 'folder' | 'section' | 'channel';
    }>({ isOpen: false, target: null, type: 'folder' });

    const handleBack = useCallback(() => {
        if (group) {
            navigate(`/group-settings/${group.id}`);
        }
    }, [group, navigate]);

    const handleToggleStatus = useCallback(() => {
        form.setIsSalesPlatformEnabled(!form.isSalesPlatformEnabled);
    }, [form]);

    const handleOpenOptions = useCallback((target: SalesFolder | SalesSection | Channel, type: 'folder' | 'section' | 'channel') => {
        setOptionsModal({ isOpen: true, target, type });
    }, []);

    const handleCloseOptions = useCallback(() => {
        setOptionsModal({ isOpen: false, target: null, type: 'folder' });
    }, []);

    const handleUpdateChannelProperties = useCallback((updates: Partial<Channel>) => {
        if (optionsModal.type !== 'channel' || !optionsModal.target) return;
        
        const cid = optionsModal.target.id;
        const newSections = form.salesPlatformSections.map(sec => ({
            ...sec,
            channels: sec.channels?.map(c => c.id === cid ? { ...c, ...updates } : c)
        }));
        
        form.setSalesPlatformSections(newSections);
        setOptionsModal(prev => ({ ...prev, target: { ...prev.target as Channel, ...updates } }));
    }, [optionsModal, form]);

    const handleUpdateFolderProperties = useCallback((updates: Partial<SalesFolder>) => {
        if (optionsModal.type !== 'folder' || !optionsModal.target) return;
        
        const folderId = optionsModal.target.id;
        const newSections = form.salesPlatformSections.map(sec => ({
            ...sec,
            folders: sec.folders.map(f => f.id === folderId ? { ...f, ...updates } : f)
        }));
        
        form.setSalesPlatformSections(newSections);
        setOptionsModal(prev => ({ ...prev, target: { ...prev.target as SalesFolder, ...updates } }));
    }, [optionsModal, form]);

    const handleAddFolderInside = useCallback((name: string) => {
        if (optionsModal.type !== 'section' || !optionsModal.target) return;
        const sectionId = optionsModal.target.id;

        const newFolder: SalesFolder = { id: `fold_${Date.now()}`, name, itemsCount: 0, allowDownload: true, allowMemberUpload: false };
        const newSections = form.salesPlatformSections.map(sec => {
            if (sec.id === sectionId) {
                return { ...sec, folders: [...sec.folders, newFolder] };
            }
            return sec;
        });

        form.setSalesPlatformSections(newSections);
    }, [optionsModal, form]);

    const handleAddChannelInside = useCallback((name: string) => {
        if (optionsModal.type !== 'section' || !optionsModal.target) return;
        const sectionId = optionsModal.target.id;
        
        const newChannel: Channel = { id: `ch_plt_${Date.now()}`, name, onlyAdminsPost: false, type: 'text' };
        const newSections = form.salesPlatformSections.map(sec => {
            if (sec.id === sectionId) {
                return { ...sec, channels: [...(sec.channels || []), newChannel] };
            }
            return sec;
        });

        form.setSalesPlatformSections(newSections);
    }, [optionsModal, form]);

    return {
        group,
        loading,
        form,
        optionsModal,
        handleSave,
        handleBack,
        handleToggleStatus,
        handleOpenOptions,
        handleCloseOptions,
        handleUpdateChannelProperties,
        handleUpdateFolderProperties,
        handleAddFolderInside,
        handleAddChannelInside
    };
};
