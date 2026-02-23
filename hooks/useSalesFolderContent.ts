
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { postService } from '../ServiçosFrontend/ServiçoDePosts/postService';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { Group, SalesFolder, Infoproduct } from '../types';

export const useSalesFolderContent = () => {
    const navigate = useNavigate();
    const { groupId, folderId } = useParams<{ groupId: string, folderId: string }>();
    
    const [group, setGroup] = useState<Group | null>(null);
    const [folder, setFolder] = useState<SalesFolder | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOwnerOrAdmin, setIsOwnerOrAdmin] = useState(false);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadCurrentItem, setUploadCurrentItem] = useState(0);
    const [uploadTotalItems, setUploadTotalItems] = useState(0);

    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (groupId && folderId) {
            setLoading(true);
            const foundGroup = groupService.getGroupById(groupId);
            if (foundGroup) {
                setGroup(foundGroup);
                
                const currentUserId = authService.getCurrentUserId();
                const isOwner = foundGroup.creatorId === currentUserId;
                const isAdmin = foundGroup.adminIds?.includes(currentUserId || '') || false;
                setIsOwnerOrAdmin(isOwner || isAdmin);

                let foundFolder: SalesFolder | null = null;
                foundGroup.salesPlatformSections?.forEach(sec => {
                    const f = sec.folders.find(fold => fold.id === folderId);
                    if (f) foundFolder = f;
                });
                
                if (foundFolder && (!foundFolder.items || foundFolder.items.length === 0)) {
                    foundFolder.items = [];
                }
                setFolder(foundFolder);
            } else {
                navigate('/groups');
            }
            setLoading(false);
        } else {
            navigate('/groups');
        }
    }, [groupId, folderId, navigate]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileUpload = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0 || !group || !folder) return;

        const fileArray = Array.from(files);
        setIsUploading(true);
        setUploadTotalItems(fileArray.length);
        setUploadCurrentItem(0);
        setUploadProgress(0);

        const newItems: Infoproduct[] = [];

        for (let i = 0; i < fileArray.length; i++) {
            const file: File = fileArray[i];
            setUploadCurrentItem(i + 1);
            setUploadProgress(Math.round(((i) / fileArray.length) * 100));

            try {
                const fileUrl = await postService.uploadMedia(file, 'infoproducts');
                const sizeStr = formatFileSize(file.size);
                const extension = file.name.split('.').pop()?.toLowerCase() || 'file';
                
                let type: 'image' | 'video' | 'file' = 'file';
                if (file.type.startsWith('image/')) type = 'image';
                else if (file.type.startsWith('video/')) type = 'video';

                const newItem: Infoproduct = {
                    id: `item_${Date.now()}_${i}`,
                    title: file.name.lastIndexOf('.') > 0 ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name,
                    type: type,
                    fileType: extension as any,
                    url: fileUrl,
                    allowDownload: true, 
                    size: sizeStr
                };
                newItems.push(newItem);
                setUploadProgress(Math.round(((i + 1) / fileArray.length) * 100));
            } catch (error) {
                console.error("Erro ao subir arquivo:", file.name, error);
            }
        }

        if (newItems.length > 0 && group) {
            const updatedGroup = { ...group };
            let updatedFolder: SalesFolder | null = null;
            
            updatedGroup.salesPlatformSections = updatedGroup.salesPlatformSections?.map(sec => ({
                ...sec,
                folders: sec.folders.map(f => {
                    if (f.id === folderId) {
                        const newFolderItems = [...(f.items || []), ...newItems];
                        updatedFolder = { ...f, items: newFolderItems, itemsCount: newFolderItems.length };
                        return updatedFolder;
                    }
                    return f;
                })
            }));

            if(updatedFolder) {
                setFolder(updatedFolder);
                setGroup(updatedGroup);
                await groupService.updateGroup(updatedGroup);
            }
        }
        
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
        }, 1000);
    }, [group, folder, folderId]);
    
    const handleBack = useCallback(() => navigate(-1), [navigate]);
    const handleOpenPreview = useCallback((index: number) => setPreviewIndex(index), []);
    const handleClosePreview = useCallback(() => setPreviewIndex(null), []);
    const triggerFileInput = useCallback(() => fileInputRef.current?.click(), []);

    const allowDownload = folder?.allowDownload ?? group?.salesPlatformAllowDownload ?? true;
    const allowMemberUpload = folder?.allowMemberUpload ?? group?.salesPlatformAllowMemberUpload ?? false;
    const canUpload = isOwnerOrAdmin || allowMemberUpload;

    return {
        loading,
        folder,
        canUpload,
        allowDownload,
        isUploading,
        uploadProgress,
        uploadCurrentItem,
        uploadTotalItems,
        fileInputRef,
        handleFileUpload,
        triggerFileInput,
        previewIndex,
        handleOpenPreview,
        handleClosePreview,
        handleBack
    };
};
